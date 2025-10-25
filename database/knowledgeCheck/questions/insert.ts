'use server'

import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_answer, db_category, db_question } from '@/drizzle/schema'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { ChoiceQuestion, DragDropQuestion, Question } from '@/src/schemas/QuestionSchema'

export default async function insertKnowledgeCheckQuestions(db: DrizzleDB, questions: Question[], check_id: KnowledgeCheck['id']) {
  await requireAuthentication()

  for (const question of questions) {
    await insertQuestion(db, question, check_id)
  }
}

async function insertQuestion(db: DrizzleDB, question: Question, check_id: KnowledgeCheck['id']) {
  await requireAuthentication()

  const category_id = await findInsertCategory(db, question.category)

  const [{ id }] = await db
    .insert(db_question)
    .values({
      ...question,
      categoryId: category_id,
      knowledgecheckId: check_id,
    })
    .$returningId()

  switch (question.type) {
    case 'multiple-choice':
      await insertChoiceAnswers(db, id, question.answers as ChoiceQuestion['answers'])
      break
    case 'single-choice':
      await insertChoiceAnswers(db, id, question.answers as ChoiceQuestion['answers'])
      break
    case 'open-question':
      await insertOpenAnswer(db, id, question.expectation || '')
      break
    case 'drag-drop':
      await insertDragDropAnswers(db, id, question.answers as DragDropQuestion['answers'])
      break
  }
}

async function findInsertCategory(db: DrizzleDB, category_name: Question['category']) {
  await requireAuthentication()

  const categories = await db.select({ id: db_category.id }).from(db_category).where(eq(db_category.name, category_name))

  if (categories.length === 0) {
    const [{ id }] = await db
      .insert(db_category)
      .values({
        name: category_name,
      })
      .$returningId()
    return id
  }

  return categories.at(0)!.id
}

async function insertChoiceAnswers(db: DrizzleDB, question_id: Question['id'], answers: ChoiceQuestion['answers']) {
  await requireAuthentication()

  for (const answer of answers) {
    await db.insert(db_answer).values({
      id: getUUID(),
      questionId: question_id,
      answer: answer.answer,
      correct: answer.correct ? 1 : 0,
    })
  }
}

async function insertOpenAnswer(db: DrizzleDB, question_id: Question['id'], answer: string) {
  await requireAuthentication()

  await db.insert(db_answer).values({
    id: getUUID(),
    answer: answer,
    questionId: question_id,
  })
}

async function insertDragDropAnswers(db: DrizzleDB, question_id: Question['id'], answers: DragDropQuestion['answers']) {
  await requireAuthentication()

  for (const answer of answers) {
    await db.insert(db_answer).values({
      id: getUUID(),
      answer: answer.answer,
      questionId: question_id,
      position: answer.position,
    })
  }
}
