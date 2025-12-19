'use server'

import { DrizzleDB } from '@/database/Database'
import { db_answer, db_question } from '@/database/drizzle/schema'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { ChoiceQuestion, DragDropQuestion, Question } from '@/src/schemas/QuestionSchema'

export default async function insertKnowledgeCheckQuestions(db: DrizzleDB, questions: Array<Question & { categoryId: string }>, check_id: KnowledgeCheck['id']) {
  await requireAuthentication()

  let index = 0
  for (const question of questions) {
    await insertQuestion(db, question, check_id, index++)
  }
}

async function insertQuestion(db: DrizzleDB, question: Question & { categoryId: string }, check_id: KnowledgeCheck['id'], position: number) {
  await requireAuthentication()

  const [{ id }] = await db
    .insert(db_question)
    .values({
      id: question.id,
      type: question.type,
      question: question.question,
      points: question.points,
      categoryId: question.categoryId,
      knowledgecheckId: check_id,
      accessibility: question.accessibility,
      _position: position,
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

async function insertChoiceAnswers(db: DrizzleDB, question_id: Question['id'], answers: ChoiceQuestion['answers']) {
  await requireAuthentication()

  let index = 0
  for (const answer of answers) {
    await db.insert(db_answer).values({
      id: answer.id,
      questionId: question_id,
      answer: answer.answer,
      correct: answer.correct ? 1 : 0,
      _position: index++,
    })
  }
}

async function insertOpenAnswer(db: DrizzleDB, question_id: Question['id'], answer: string) {
  await requireAuthentication()

  await db.insert(db_answer).values({
    id: getUUID(),
    answer: answer,
    questionId: question_id,
    _position: 0,
  })
}

async function insertDragDropAnswers(db: DrizzleDB, question_id: Question['id'], answers: DragDropQuestion['answers']) {
  await requireAuthentication()

  let index = 0
  for (const answer of answers) {
    await db.insert(db_answer).values({
      id: answer.id,
      answer: answer.answer,
      questionId: question_id,
      position: answer.position,
      _position: index++,
    })
  }
}
