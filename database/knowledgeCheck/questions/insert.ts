'use server'

import { DBConnection } from '@/database/Database'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { ChoiceQuestion, DragDropQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export default async function insertKnowledgeCheckQuestions(db: DBConnection, questions: Question[], check_id: KnowledgeCheck['id']) {
  for (const question of questions) {
    await insertQuestion(db, question, check_id)
  }
}

async function insertQuestion(db: DBConnection, question: Question, check_id: KnowledgeCheck['id']) {
  const category_id = await findInsertCategory(db, question.category)
  const { id } = await db.insert('INSERT INTO Question (id, type, question, category_id, knowledgecheck_id) Values (?, ?, ?, ?, ?)', [
    question.id,
    question.type,
    question.question,
    category_id,
    check_id,
  ])

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

async function findInsertCategory(db: DBConnection, category: Question['category']) {
  const [categories] = await db.execute<Any[]>('SELECT id, name FROM Category WHERE name = ?', [category])

  if (categories.length === 0) {
    const { id } = await db.insert('INSERT INTO Category (id, name, prequisite_category_id) Values (?, ?, ?)', [getUUID(), category, null])
    return id
  }

  return categories[0].id
}

async function insertChoiceAnswers(db: DBConnection, question_id: Question['id'], answers: ChoiceQuestion['answers']) {
  for (const answer of answers) {
    await db.insert('INSERT INTO Answer (id, answer, Question_id, correct) Values (?, ?, ?, ?)', [getUUID(), answer.answer, question_id, answer.correct ? 1 : 0])
  }
}

async function insertOpenAnswer(db: DBConnection, question_id: Question['id'], answer: string) {
  await db.insert('INSERT INTO Answer (id, answer, Question_id, correct) Values (?, ?, ?, ?)', [getUUID(), answer, question_id, null])
}

async function insertDragDropAnswers(db: DBConnection, question_id: Question['id'], answers: DragDropQuestion['answers']) {
  for (const answer of answers) {
    await db.insert('INSERT INTO Answer (id, answer, Question_id, position) Values (?, ?, ?, ?)', [getUUID(), answer.answer, question_id, answer.position])
  }
}
