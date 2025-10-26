'use server'

import { User } from 'better-auth'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import insertKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/insert'
import insertKnowledgeCheckSettings from '@/database/knowledgeCheck/settings/insert'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

export default async function insertKnowledgeCheck(user_id: User['id'], check: KnowledgeCheck) {
  await requireAuthentication()

  const db = await getDatabase()
  await db.transaction(async (transaction) => {
    try {
      const [{ id }] = await transaction
        .insert(db_knowledgeCheck)
        .values({
          id: check.id,
          name: check.name,
          description: check.description,
          difficulty: check.difficulty,
          share_key: check.share_key,
          owner_id: user_id,
          openDate: formatDatetime(check.openDate),
          closeDate: check.closeDate ? formatDatetime(check.closeDate) : null,
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
  const db = await getDatabase()

  await db.update(db_knowledgeCheck).set({ share_key: token }).where(eq(db_knowledgeCheck.id, check_id))
}
