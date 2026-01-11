'use server'

import { User } from 'better-auth'
import { desc, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_category, db_knowledgeCheck, db_knowledgeCheckSettings } from '@/database/drizzle/schema'
import { getCategoriesByCheckId } from '@/database/knowledgeCheck/catagories/select'
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
    const categories = await getCategoriesByCheckId(knowledgeCheck.id)
    const settings = await getKnowledgeCheckSettingsById(knowledgeCheck.id)
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id, categories)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions, settings, categories)

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
    const categories = await getCategoriesByCheckId(knowledgeCheck.id)
    const settings = await getKnowledgeCheckSettingsById(knowledgeCheck.id)
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id, categories)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions, settings, categories)

    checks.push(parsedKnowledgeCheck)
  }

  return checks?.at(0) || null
}

export async function getKnowledgeCheckByShareToken(token: string) {
  const db = await getDatabase()

  const [rawCheck] = await db.select().from(db_knowledgeCheck).where(eq(db_knowledgeCheck.share_key, token)).limit(1)
  if (!rawCheck) return null

  const categories = await getCategoriesByCheckId(rawCheck.id)
  const settings = await getKnowledgeCheckSettingsById(rawCheck.id)
  const questions = await getKnowledgeCheckQuestions(db, rawCheck.id, categories)
  const check = parseKnowledgeCheck(rawCheck, questions, settings, categories)

  return check
}

function parseKnowledgeCheck(
  knowledgeCheck: typeof db_knowledgeCheck.$inferSelect,
  questions: Question[],
  settings: KnowledgeCheckSettings,
  categories: (typeof db_category.$inferSelect)[],
): KnowledgeCheck {
  return {
    id: knowledgeCheck.id,
    name: knowledgeCheck.name,
    description: knowledgeCheck.description,
    share_key: knowledgeCheck.share_key,
    questions,
    difficulty: knowledgeCheck.difficulty,
    closeDate: knowledgeCheck.closeDate ? new Date(Date.parse(knowledgeCheck.closeDate)) : null,
    openDate: new Date(Date.parse(knowledgeCheck.openDate)),
    questionCategories: categories.map((c): KnowledgeCheck['questionCategories'][number] => ({
      id: c.id,
      name: c.name,
      skipOnMissingPrequisite: false,
      prequisiteCategoryId: c.prequisiteCategoryId ?? undefined,
    })),

    createdAt: new Date(Date.parse(knowledgeCheck.createdAt)),
    updatedAt: new Date(Date.parse(knowledgeCheck.updatedAt)),
    owner_id: knowledgeCheck.owner_id,
    settings,
  }
}

export async function getPublicKnowledgeChecks({ limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
  await requireAuthentication()

  const db = await getDatabase()
  const checks: KnowledgeCheck[] = []

  const knowledgeChecks = await db
    .select()
    .from(db_knowledgeCheck)
    .innerJoin(db_knowledgeCheckSettings, eq(db_knowledgeCheck.id, db_knowledgeCheckSettings.knowledgecheckId))
    .where(eq(db_knowledgeCheckSettings.shareAccessibility, 1))
    .offset(offset)
    .limit(limit > 100 ? 100 : limit)
    .orderBy(desc(db_knowledgeCheck.updatedAt))

  for (const { KnowledgeCheck: knowledgeCheck } of knowledgeChecks) {
    const categories = await getCategoriesByCheckId(knowledgeCheck.id)
    const settings = await getKnowledgeCheckSettingsById(knowledgeCheck.id)
    const questions = await getKnowledgeCheckQuestions(db, knowledgeCheck.id, categories)
    const parsedKnowledgeCheck = parseKnowledgeCheck(knowledgeCheck, questions, settings, categories)

    checks.push(parsedKnowledgeCheck)
  }

  return checks
}
