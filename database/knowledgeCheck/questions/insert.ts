'use server'

import { DBConnection } from '@/database/Database'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export default async function insertKnowledgeCheckQuestions(db: DBConnection, questions: Question[], check_id: KnowledgeCheck['id']) {
  for (const question of questions) {
    await insertQuestion(db, question, check_id)
  }
}

async function insertQuestion(db: DBConnection, question: Question, check_id: KnowledgeCheck['id']) {
  const category_id = await findInsertCategory(db, question.category)
  return await db.insert('INSERT INTO Question (id, type, question, category_id, knowledgecheck_id) Values (?, ?, ?, ?, ?)', [question.id, question.type, question.question, category_id, check_id])
}

async function findInsertCategory(db: DBConnection, category: Question['category']) {
  const [categories] = await db.execute<Any[]>('SELECT id, name FROM Category WHERE name = ?', [category])

  if (categories.length === 0) {
    const { id } = await db.insert('INSERT INTO Category (id, name, prequisite_category_id) Values (?, ?, ?)', [getUUID(), category, null])
    return id
  }

  return categories[0].id
}
