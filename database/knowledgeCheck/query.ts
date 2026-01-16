import { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { DrizzleSchema } from '@/database/drizzle'
import { DatabaseOptions } from '@/database/knowledgeCheck/type'
import buildKnowledgeCheckWhere, { KnowledgeCheckFilterBundle } from '@/database/utils/buildKnowledgeCheckWhere'
import { KnowledgeCheck, safeParseKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { instantiateKnowledgeCheckSettings, KnowledgeCheckSettings, safeParseKnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

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
    orderBy: (q, { asc }) => [asc(q._position)],
    columns: {
      knowledgecheckId: false,
      categoryId: false,
    },
    with: {
      answers: {
        orderBy: (a, { asc }) => [asc(a._position)],
        columns: {
          questionId: false,
        },
      },
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

export async function getKnowledgeChecks({ limit = 10, offset, ...filterBundle }: {} & KnowledgeCheckFilterBundle & DatabaseOptions = {}): Promise<KnowledgeCheck[]> {
  const db = await getDatabase()

  const checks = await db.query.db_knowledgeCheck.findMany({
    where: buildKnowledgeCheckWhere(db, filterBundle),
    with: knowledgeCheckWithAllConfig,
    orderBy: (kc, { desc }) => [desc(kc.updatedAt)],
    limit: limit,
    offset,
  })

  return checks.map(parseCheck).filter((check) => check !== null)
}

function parseCheck({ questions, knowledgeCheckSettings: settings, categories, ...check }: KnowledgeCheckWithAll): KnowledgeCheck | null {
  const result = safeParseKnowledgeCheck({
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

  if (!result.success) {
    console.error(`Failed to parse knowledgeCheck instance ${check.id} because: `, result.error)
  }

  return result.data ?? null
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
      return { expectation: answers.at(0)?.answer }

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
  const result = safeParseKnowledgeCheckSettings(setting)
  if (result.error && setting !== null) console.error('Failed to parse existing setting', setting, 'because of', result.error)

  return result.data ?? instantiateKnowledgeCheckSettings()
}
