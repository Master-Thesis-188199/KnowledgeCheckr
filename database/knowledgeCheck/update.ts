import { User } from 'better-auth'
import { eq } from 'drizzle-orm'
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
      await insertKnowledgeCheck(user_id, updatedCheck)
    } catch (err) {
      await tx.rollback()
      logger.error('[Rollback]: Error updating knowledge check:', err)
    }
  })
}
