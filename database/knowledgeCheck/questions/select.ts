import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { DrizzleDB } from '@/database/Database'
import { db_answer, db_category, db_question } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export default async function getKnowledgeCheckQuestions(db: DrizzleDB, knowledgeCheck_id: KnowledgeCheck['id'], categories: (typeof db_category.$inferSelect)[]) {
  await requireAuthentication()

  const questions: Question[] = []

  const raw_questions = await db.select().from(db_question).where(eq(db_question.knowledgecheckId, knowledgeCheck_id)).orderBy(db_question._position)

  for (const question of raw_questions) {
    const answers = await db.select().from(db_answer).where(eq(db_answer.questionId, question.id)).orderBy(db_answer._position)
    const category = categories.find((c) => c.id === question.categoryId)!.name

    questions.push({
      id: question.id,
      type: question.type as Any,
      question: question.question,
      category,
      points: question.points,
      accessibility: question.accessibility,
      ...parseAnswer(question.type, answers),
    })
  }

  return questions
}

function parseAnswer(
  question_type: Question['type'],
  answers: (typeof db_answer.$inferSelect)[],
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

export async function getKnowledgeCheckQuestionById<ExpectedQuestion extends Question>(question_id: Question['id']): Promise<ExpectedQuestion | null> {
  const db = await getDatabase()

  const [dbQuestion] = await db.select().from(db_question).where(eq(db_question.id, question_id)).limit(1)
  if (!dbQuestion) return null

  const answers = await db.select().from(db_answer).where(eq(db_answer.questionId, question_id)).orderBy(db_answer._position)

  const [category] = await db.select({ name: db_category.name }).from(db_category).where(eq(db_category.id, dbQuestion.categoryId)).limit(1)
  if (category === undefined) logger.warn('Category was not found in question retrieval (getKnowledgeCheckQuestionById)')

  const question = {
    id: dbQuestion.id,
    type: dbQuestion.type as Any,
    question: dbQuestion.question,
    category: category.name,
    points: dbQuestion.points,
    accessibility: dbQuestion.accessibility,
    ...parseAnswer(dbQuestion.type, answers),
  } as ExpectedQuestion

  return question
}
