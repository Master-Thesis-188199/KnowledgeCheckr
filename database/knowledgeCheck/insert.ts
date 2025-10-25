'use server'

import { User } from 'better-auth'
import { eq } from 'drizzle-orm'
import getDatabase, { getDrizzleDatabase } from '@/database/Database'
import insertKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/insert'
import insertKnowledgeCheckSettings from '@/database/knowledgeCheck/settings/insert'
import { db_knowledgeCheck } from '@/drizzle/schema'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

export default async function insertKnowledgeCheck(user_id: User['id'], check: KnowledgeCheck, transaction = true) {
  await requireAuthentication()

  const db = await getDrizzleDatabase()
  db.transaction(async (transaction) => {
    try {
      const [{ id }] = await transaction
        .insert(db_knowledgeCheck)
        .values({
          ...check,
          owner_id: user_id,
          openDate: formatDatetime(check.openDate),
          closeDate: formatDatetime(check.closeDate ?? new Date(Date.now())),
          createdAt: undefined,
          updatedAt: undefined,
        })
        .$returningId()

      if (!id) throw new Error('Database insert statement did not return inserted-`id`')

      await insertKnowledgeCheckSettings(db, null, id)
      await insertKnowledgeCheckQuestions(db, check.questions, id)
    } catch (err) {
      console.log('[Rollback]: Inserting db_knowledgecheck was unsuccessful!', err)
      transaction.rollback()
    }
  })
}

export async function storeKnowledgeCheckShareToken(check_id: KnowledgeCheck['id'], token: string) {
  await requireAuthentication()
  const db = await getDrizzleDatabase()

  const duplicateTokens = await db.select({ id: db_knowledgeCheck.id }).from(db_knowledgeCheck).where(eq(db_knowledgeCheck.share_key, token))

  if (duplicateTokens.length > 0) throw new Error('Storing KnowledgeCheck share token failed because this token is already used!')

  await db.update(db_knowledgeCheck).set({ share_key: token }).where(eq(db_knowledgeCheck.id, check_id))
}
