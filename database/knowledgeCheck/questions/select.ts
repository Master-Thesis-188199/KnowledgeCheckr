import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { DrizzleDB } from '@/database/Database'
import { db_answer, db_category, db_question } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export default async function getKnowledgeCheckQuestions(db: DrizzleDB, knowledgeCheck_id: KnowledgeCheck['id']) {
  await requireAuthentication()

  const questions: Question[] = []

  const raw_questions = await db.select().from(db_question).where(eq(db_question.knowledgecheckId, knowledgeCheck_id))

  for (const question of raw_questions) {
    const answers = await db.select().from(db_answer).where(eq(db_answer.questionId, question.id))
    const category = await parseCategory(db, question.categoryId)

    questions.push({
      id: question.id,
      type: question.type as Any,
      question: question.question,
      category,
      points: question.points,
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
          position: raw_mcq.correct!,
        })),
      }
  }
}

async function parseCategory(db: DrizzleDB, category_id: string): Promise<Question['category']> {
  await requireAuthentication()

  const categories = await db.select({ name: db_category.name }).from(db_category).where(eq(db_category.id, category_id))

  return categories.at(0)!.name
}

export async function getKnowledgeCheckQuestionById<ExpectedQuestion extends Question>(question_id: Question['id']): Promise<ExpectedQuestion | null> {
  const db = await getDatabase()

  const [dbQuestion] = await db.select().from(db_question).where(eq(db_question.id, question_id)).limit(1)
  const answers = await db.select().from(db_answer).where(eq(db_answer.questionId, question_id))

  const category = await parseCategory(db, dbQuestion.categoryId)

  const question = {
    id: dbQuestion.id,
    type: dbQuestion.type as Any,
    question: dbQuestion.question,
    category,
    points: dbQuestion.points,
    ...parseAnswer(dbQuestion.type, answers),
  } as ExpectedQuestion

  return question
}
