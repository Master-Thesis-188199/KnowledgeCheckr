'use server'

import { User } from 'better-auth'
import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export async function updateKnowledgeCheck(user_id: User['id'], updatedCheck: KnowledgeCheck) {
  await requireAuthentication()

  const db = await getDatabase()

  await db.transaction(async (tx) => {
    try {
      await tx.delete(db_knowledgeCheck).where(eq(db_knowledgeCheck.id, updatedCheck.id))
      await insertKnowledgeCheck(updatedCheck)
    } catch (err) {
      await tx.rollback()
      logger.error('[Rollback]: Error updating knowledge check:', err)
    }
  })
}

export async function updateKnowledgeCheckShareToken({ checkId, token }: { checkId: KnowledgeCheck['id']; token: KnowledgeCheck['share_key'] }) {
  const {
    user: { id: userId },
  } = await requireAuthentication()
  const db = await getDatabase()

  const result = await db
    .update(db_knowledgeCheck)
    .set({ share_key: token })
    .where(and(eq(db_knowledgeCheck.id, checkId), eq(db_knowledgeCheck.owner_id, userId)))
  return result[0].affectedRows > 0
}
