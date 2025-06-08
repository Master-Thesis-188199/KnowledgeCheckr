'use server'

import getDatabase from '@/database/Database'
import getKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/select'
import { DbKnowledgeCheck } from '@/database/knowledgeCheck/type'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'
import { User } from 'better-auth'

export async function getKnowledgeChecksByOwner(user_id: User['id'], { limit = 10 }: { limit?: number }) {
  const db = await getDatabase()
  const checks: KnowledgeCheck[] = []

  const knowledgeChecks = await db.exec<DbKnowledgeCheck[]>(`SELECT * FROM KnowledgeCheck WHERE owner_id = ? Limit ${limit > 100 ? 100 : limit}`, [user_id])
  for (const knowledgeCheck of knowledgeChecks) {
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions)

    checks.push(parsedKnowledgeCheck)
  }

  return checks
}

export async function getKnowledgeCheckById(id: KnowledgeCheck['id']): Promise<KnowledgeCheck | null> {
  const db = await getDatabase()
  const checks: KnowledgeCheck[] = []

  const knowledgeChecks = await db.exec<DbKnowledgeCheck[]>(`SELECT * FROM KnowledgeCheck WHERE id = ?`, [id])
  for (const knowledgeCheck of knowledgeChecks) {
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions)

    checks.push(parsedKnowledgeCheck)
  }

  return checks?.at(0) || null
}

function parseKnowledgeCheck(knowledgeCheck: DbKnowledgeCheck, questions: Question[]): KnowledgeCheck {
  return {
    id: knowledgeCheck.id,
    name: knowledgeCheck.name,
    description: knowledgeCheck.description,
    share_key: knowledgeCheck.public_token,
    questions,
    difficulty: knowledgeCheck.difficulty,
    closeDate: knowledgeCheck.closeDate,
    openDate: knowledgeCheck.openDate,
    questionCategories: [],
  }
}
