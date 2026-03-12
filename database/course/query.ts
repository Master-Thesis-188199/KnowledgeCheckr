import { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm'
import { convertSettings } from '@/database/course/settings/transform'
import { DatabaseOptions } from '@/database/course/type'
import getDatabase from '@/database/Database'
import { DrizzleSchema } from '@/database/drizzle'
import buildCourseWhere, { CourseFilterBundle } from '@/database/utils/buildKnowledgeCheckWhere'
import { Course, safeParseCourse } from '@/src/schemas/KnowledgeCheck'
import { CourseSettings, instantiateCourseSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

//* joins the knowledgeCheck table with the following tables and aggregates the results: `Settings`, `Questions`, `Answers` and `Category`
const courseWithAllConfig = {
  userContributesToKnowledgeChecks: {
    columns: {
      knowledgecheckId: false,
    },
  },
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
} as const satisfies CourseWith

type Tables = ExtractTablesWithRelations<DrizzleSchema>
type CourseTable = Tables['db_course']
type CourseWith = DBQueryConfig<'one' | 'many', boolean, Tables, CourseTable>['with']

type CourseTableConfig = Tables['db_course']

export type CourseWithAll = BuildQueryResult<Tables, CourseTableConfig, { with: typeof courseWithAllConfig }>

export async function getCourses({ limit = 10, offset, ...filterBundle }: {} & CourseFilterBundle & DatabaseOptions = {}): Promise<Course[]> {
  const db = await getDatabase()

  const courses = await db.query.db_course.findMany({
    where: buildCourseWhere(db, filterBundle),
    with: courseWithAllConfig,
    orderBy: (kc, { desc }) => [desc(kc.updatedAt)],
    limit: limit,
    offset,
  })

  return courses.map(parseCourse).filter((check) => check !== null)
}

function parseCourse({ questions, knowledgeCheckSettings: settings, categories, userContributesToKnowledgeChecks: collaboratorIds, ...check }: CourseWithAll): Course | null {
  const result = safeParseCourse({
    ...check,
    collaborators: collaboratorIds.map((c) => c.userId),
    questions: questions.map(parseQuestion),
    questionCategories: categories.map((c): Course['questionCategories'][number] => ({
      ...c,
      skipOnMissingPrequisite: false,
    })),
    settings: parseSetting(settings),
  })

  if (!result.success) {
    console.error(`Failed to parse course instance ${check.id} because: `, result.error)
  }

  return result.data ?? null
}

function parseQuestion({ category, answers, ...question }: CourseWithAll['questions'][number]): Question {
  return { ...question, type: question.type as Any, category: category.name, ...parseAnswers(question.type, answers) }
}

function parseAnswers(
  question_type: Question['type'],
  answers: CourseWithAll['questions'][number]['answers'],
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

function parseSetting(setting: CourseWithAll['knowledgeCheckSettings']): CourseSettings {
  return convertSettings('from-database', setting) ?? instantiateCourseSettings()
}
