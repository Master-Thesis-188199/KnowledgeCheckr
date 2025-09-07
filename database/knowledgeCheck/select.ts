'use server'

import getDatabase from '@/database/Database'
import getKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/select'
import { DbKnowledgeCheck } from '@/database/knowledgeCheck/type'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'
import { User } from 'better-auth'

export async function getKnowledgeChecksByOwner(user_id: User['id'], { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
  await requireAuthentication()

  const db = await getDatabase()
  const checks: KnowledgeCheck[] = []

  const knowledgeChecks = await db.exec<DbKnowledgeCheck[]>(`SELECT * FROM KnowledgeCheck WHERE owner_id = ? Order By updatedAt DESC Limit ${limit > 100 ? 100 : limit} OFFSET ?`, [
    user_id,
    (offset ?? '0').toString(),
  ])
  for (const knowledgeCheck of knowledgeChecks) {
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions)

    checks.push(parsedKnowledgeCheck)
  }

  return checks
}

export async function getKnowledgeCheckById(id: KnowledgeCheck['id']): Promise<KnowledgeCheck | null> {
  await requireAuthentication()

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

export async function getKnowledgeCheckByShareToken(token: string) {
  const db = await getDatabase()

  const rawCheck = (await db.exec<DbKnowledgeCheck[]>('SELECT * from KnowledgeCheck WHERE public_token = ?', [token]))?.at(0)
  if (!rawCheck) return null

  const questions = await getKnowledgeCheckQuestions(db, rawCheck.id)
  const check = parseKnowledgeCheck(rawCheck, questions)

  return check
}

function parseKnowledgeCheck(knowledgeCheck: DbKnowledgeCheck, questions: Question[]): KnowledgeCheck {
  return {
    id: knowledgeCheck.id,
    name: knowledgeCheck.name,
    description: knowledgeCheck.description,
    share_key: knowledgeCheck.public_token,
    questions,
    difficulty: knowledgeCheck.difficulty,
    closeDate: knowledgeCheck.closeDate ? new Date(Date.parse(knowledgeCheck.closeDate)) : null,
    openDate: new Date(Date.parse(knowledgeCheck.openDate)),
    questionCategories: [],
  }
}
