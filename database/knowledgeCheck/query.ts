/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, AnyColumn, BuildQueryResult, DBQueryConfig, eq, ExtractTablesWithRelations, SQL, sql } from 'drizzle-orm'
import { alias, AnyMySqlTable, BuildAliasTable, MySqlColumn } from 'drizzle-orm/mysql-core'
import getDatabase, { DrizzleDB } from '@/database/Database'
import { db_answer, db_category, db_knowledgeCheck, db_knowledgeCheckSettings, db_question, DrizzleSchema } from '@/database/drizzle'
import { DatabaseOptions } from '@/database/knowledgeCheck/type'
import buildWhere, { TableFilters } from '@/database/utils/buildWhere'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheck, validateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateKnowledgeCheckSettings, KnowledgeCheckSettings, safeParseKnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

//* joins the knowledgeCheck table with the following tables and aggregates the results: `Settings`, `Questions`, `Answers` and `Category`
const knowledgeCheckWithAllConfig = {
  categories: {
    columns: {
      knowledgecheckId: false,
    },
  },

  knowledgeCheckSettings: {
    columns: {
      knowledgecheckId: false,
    },
  },
  questions: {
    orderBy: (q, { desc }) => [desc(q._position)],
    columns: {
      knowledgecheckId: false,
      categoryId: false,
    },
    with: {
      answers: true,
      category: {
        columns: {
          knowledgecheckId: false,
        },
      },
    },
  },
} as const satisfies KcWith

type Tables = ExtractTablesWithRelations<DrizzleSchema>
type KcTable = Tables['db_knowledgeCheck']
type KcWith = DBQueryConfig<'one' | 'many', boolean, Tables, KcTable>['with']

type KnowledgeCheckTableConfig = Tables['db_knowledgeCheck']

export type KnowledgeCheckWithAll = BuildQueryResult<Tables, KnowledgeCheckTableConfig, { with: typeof knowledgeCheckWithAllConfig }>

export async function getKnowledgeCheck({ limit = 10, offset, ...filterBundle }: {} & KnowledgeCheckFilterBundle & DatabaseOptions = {}) {
  const db = await getDatabase()

  const checks = await db.query.db_knowledgeCheck.findMany({
    where: buildKnowledgeCheckWhere(db, filterBundle),
    with: knowledgeCheckWithAllConfig,
    orderBy: (kc, { desc }) => [desc(kc.updatedAt)],
    limit: limit,
    offset,
  })

  return checks.map(parseCheck)
}

function parseCheck({ questions, knowledgeCheckSettings: settings, categories, ...check }: KnowledgeCheckWithAll) {
  return validateKnowledgeCheck({
    ...check,
    questions: questions.map(parseQuestion),
    questionCategories: categories.map((c): KnowledgeCheck['questionCategories'][number] => ({
      id: c.id,
      name: c.name,
      skipOnMissingPrequisite: false,
      prequisiteCategoryId: c.prequisiteCategoryId ?? undefined,
    })),
    settings: parseSetting(settings),
  })
}

function parseQuestion({ category, answers, ...question }: KnowledgeCheckWithAll['questions'][number]): Question {
  return { ...question, type: question.type as Any, category: category.name, ...parseAnswers(question.type, answers) }
}

function parseAnswers(
  question_type: Question['type'],
  answers: KnowledgeCheckWithAll['questions'][number]['answers'],
): Pick<ChoiceQuestion, 'answers'> | Pick<OpenQuestion, 'expectation'> | Pick<DragDropQuestion, 'answers'> {
  switch (question_type) {
    case 'multiple-choice':
      return {
        answers: answers.map((raw_mcq): ChoiceQuestion['answers'][number] => ({
          id: raw_mcq.id,
          answer: raw_mcq.answer,
          correct: raw_mcq.correct === 1,
        })),
      }
    case 'single-choice':
      return {
        answers: answers.map((raw_mcq): ChoiceQuestion['answers'][number] => ({
          id: raw_mcq.id,
          answer: raw_mcq.answer,
          correct: raw_mcq.correct === 1,
        })),
      }

    case 'open-question':
      return { expectation: answers.join('. ') }

    case 'drag-drop':
      return {
        answers: answers.map((raw_mcq): DragDropQuestion['answers'][number] => ({
          id: raw_mcq.id,
          answer: raw_mcq.answer,
          position: raw_mcq.position!,
        })),
      }
  }
}

function parseSetting(setting: KnowledgeCheckWithAll['knowledgeCheckSettings']): KnowledgeCheckSettings {
  // if (!setting) return instantiateKnowledgeCheckSettings()
  // {
  //     ...setting,
  //     // allowFreeNavigation: setting.allowAnonymous === 1,
  //     // shareAccessibility: setting.shareAccessibility === 1,
  //     // allowAnonymous: setting.allowAnonymous === 1,
  //   }

  return safeParseKnowledgeCheckSettings(setting).data ?? instantiateKnowledgeCheckSettings()
}

type KnowledgeCheckFilterBundle = {
  baseFilter?: TableFilters<typeof db_knowledgeCheck>
  settingsFilter?: TableFilters<typeof db_knowledgeCheckSettings>
  categoriesFilter?: TableFilters<typeof db_category>
  questionsFilter?: TableFilters<typeof db_question>
  answersFilter?: TableFilters<typeof db_answer>
}
type ColumnLike = AnyColumn
function existsByFk<TChild extends AnyMySqlTable, TChildFk extends MySqlColumn<any>, TParentPk extends ColumnLike>(
  db: DrizzleDB,
  opts: {
    childTable: TChild
    aliasName: string
    childFk: (t: BuildAliasTable<TChild, string>) => TChildFk
    parentPk: TParentPk
    filter?: TableFilters<TChild>
  },
): SQL | undefined {
  if (!opts.filter) return undefined

  const t = alias(opts.childTable, opts.aliasName)
  const w = buildWhere(t as TChild, opts.filter)
  if (!w) return undefined

  const sub = db
    .select({ one: sql`1` })
    .from(t)
    .where(and(eq(opts.childFk(t), opts.parentPk), w))

  return sql`exists (${sub})`
}

function existsAnswerForKnowledgeCheck(
  db: DrizzleDB,
  kcId: ColumnLike, // usually kc.id
  answerFilter?: TableFilters<typeof db_answer>,
  questionFilter?: TableFilters<typeof db_question>,
): SQL | undefined {
  if (!answerFilter && !questionFilter) return undefined

  const a = alias(db_answer, 'a')
  const q = alias(db_question, 'q')

  const clauses: SQL[] = [eq(q.knowledgecheckId, kcId), eq(a.questionId, q.id)]

  if (answerFilter) {
    const aw = buildWhere(a, answerFilter)
    if (aw) clauses.push(aw)
  }

  if (questionFilter) {
    const qw = buildWhere(q, questionFilter)
    if (qw) clauses.push(qw)
  }

  const sub = db
    .select({ one: sql`1` })
    .from(a)
    .innerJoin(q, eq(a.questionId, q.id))
    .where(and(...clauses))

  return sql`exists (${sub})`
}
type KCFindManyArg = NonNullable<Parameters<DrizzleDB['query']['db_knowledgeCheck']['findMany']>[0]>
type KCWhereFn = Exclude<KCFindManyArg['where'], SQL | undefined>

export function buildKnowledgeCheckWhere(db: DrizzleDB, filters?: KnowledgeCheckFilterBundle): KCWhereFn {
  return (kc, { and }) => {
    const clauses: SQL[] = []

    const rootWhere = buildWhere(db_knowledgeCheck, filters?.baseFilter)
    if (rootWhere) clauses.push(rootWhere)

    const settingsExists = existsByFk(db, {
      childTable: db_knowledgeCheckSettings,
      aliasName: 'kcs',
      childFk: (t) => t.knowledgecheckId,
      parentPk: kc.id,
      filter: filters?.settingsFilter,
    })
    if (settingsExists) clauses.push(settingsExists)

    const categoriesExists = existsByFk(db, {
      childTable: db_category,
      aliasName: 'c',
      childFk: (t) => t.knowledgecheckId,
      parentPk: kc.id,
      filter: filters?.categoriesFilter,
    })
    if (categoriesExists) clauses.push(categoriesExists)

    const questionsExists = existsByFk(db, {
      childTable: db_question,
      aliasName: 'q',
      childFk: (t) => t.knowledgecheckId,
      parentPk: kc.id,
      filter: filters?.questionsFilter,
    })
    if (questionsExists) clauses.push(questionsExists)

    const answersExists = existsAnswerForKnowledgeCheck(db, kc.id, filters?.answersFilter, filters?.questionsFilter)
    if (answersExists) clauses.push(answersExists)

    return clauses.length ? and(...clauses) : undefined
  }
}
