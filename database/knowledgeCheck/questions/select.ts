'use server'

import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_answer, db_category, db_question } from '@/drizzle/schema'
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
          answer: raw_mcq.answer,
          correct: raw_mcq.correct === 1,
        })),
      }
    case 'single-choice':
      return {
        answers: answers.map((raw_mcq): ChoiceQuestion['answers'][number] => ({
          answer: raw_mcq.answer,
          correct: raw_mcq.correct === 1,
        })),
      }

    case 'open-question':
      return { expectation: answers.join('. ') }

    case 'drag-drop':
      return {
        answers: answers.map((raw_mcq): DragDropQuestion['answers'][number] => ({
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
