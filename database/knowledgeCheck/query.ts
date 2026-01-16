import { BuildQueryResult, DBQueryConfig, eq, ExtractTablesWithRelations, SQL, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_knowledgeCheckSettings, DrizzleSchema } from '@/database/drizzle'
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

export async function getKnowledgeCheck({
  filter,
  limit = 10,
  offset,
  settingsFilter,
}: { filter?: TableFilters<typeof db_knowledgeCheck>; settingsFilter?: TableFilters<typeof db_knowledgeCheckSettings> } & DatabaseOptions = {}) {
  const db = await getDatabase()

  const checks = await db.query.db_knowledgeCheck.findMany({
    where: (kc, { and }) => {
      const clauses: SQL[] = []

      const rootWhere = buildWhere(db_knowledgeCheck, filter)
      if (rootWhere) clauses.push(rootWhere)

      if (settingsFilter) {
        const kcs = alias(db_knowledgeCheckSettings, 'kcs')
        const settingsWhere = buildWhere(kcs, settingsFilter)

        if (settingsWhere) {
          const sub = db
            .select({ one: sql`1` })
            .from(kcs)
            .where(and(eq(kcs.knowledgecheckId, kc.id), settingsWhere))
          logger.info(sub.toSQL())

          clauses.push(sql`exists (${sub})`)
        }
      }

      return clauses.length ? and(...clauses) : undefined
    },
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
