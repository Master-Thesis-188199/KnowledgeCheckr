'use server'

import { User } from 'better-auth'
import { desc, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import getKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/select'
import getKnowledgeCheckSettingsById from '@/database/knowledgeCheck/settings/select'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { KnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { Question } from '@/src/schemas/QuestionSchema'

export async function getKnowledgeChecksByOwner(user_id: User['id'], { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
  await requireAuthentication()

  const db = await getDatabase()
  const checks: KnowledgeCheck[] = []

  const knowledgeChecks = await db
    .select()
    .from(db_knowledgeCheck)
    .where(eq(db_knowledgeCheck.owner_id, user_id))
    .offset(offset)
    .limit(limit > 100 ? 100 : limit)
    .orderBy(desc(db_knowledgeCheck.updatedAt))

  for (const knowledgeCheck of knowledgeChecks) {
    const settings = await getKnowledgeCheckSettingsById(knowledgeCheck.id)
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions, settings)

    checks.push(parsedKnowledgeCheck)
  }

  return checks
}

export async function getKnowledgeCheckById(id: KnowledgeCheck['id']): Promise<KnowledgeCheck | null> {
  await requireAuthentication()

  const db = await getDatabase()
  const checks: KnowledgeCheck[] = []

  const knowledgeChecks = await db.select().from(db_knowledgeCheck).where(eq(db_knowledgeCheck.id, id))

  for (const knowledgeCheck of knowledgeChecks) {
    const settings = await getKnowledgeCheckSettingsById(knowledgeCheck.id)
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions, settings)

    checks.push(parsedKnowledgeCheck)
  }

  return checks?.at(0) || null
}

export async function getKnowledgeCheckByShareToken(token: string) {
  const db = await getDatabase()

  const [rawCheck] = await db.select().from(db_knowledgeCheck).where(eq(db_knowledgeCheck.share_key, token)).limit(1)
  if (!rawCheck) return null

  const settings = await getKnowledgeCheckSettingsById(rawCheck.id)
  const questions = await getKnowledgeCheckQuestions(db, rawCheck.id)
  const check = parseKnowledgeCheck(rawCheck, questions, settings)

  return check
}

function parseKnowledgeCheck(knowledgeCheck: typeof db_knowledgeCheck.$inferSelect, questions: Question[], settings: KnowledgeCheckSettings): KnowledgeCheck {
  return {
    id: knowledgeCheck.id,
    name: knowledgeCheck.name,
    description: knowledgeCheck.description,
    share_key: knowledgeCheck.share_key,
    questions,
    difficulty: knowledgeCheck.difficulty,
    closeDate: knowledgeCheck.closeDate ? new Date(Date.parse(knowledgeCheck.closeDate)) : null,
    openDate: new Date(Date.parse(knowledgeCheck.openDate)),
    questionCategories: [],

    createdAt: new Date(Date.parse(knowledgeCheck.createdAt)),
    updatedAt: new Date(Date.parse(knowledgeCheck.updatedAt)),
    owner_id: knowledgeCheck.owner_id,
    settings,
  }
}
