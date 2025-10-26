import { User } from 'better-auth'
import { eq } from 'drizzle-orm'
import getDrizzleDatabase from '@/database/Database'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { db_knowledgeCheck } from '@/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function updateKnowledgeCheck(user_id: User['id'], updatedCheck: KnowledgeCheck) {
  await requireAuthentication()

  const db = await getDrizzleDatabase()

  await db.transaction(async (tx) => {
    try {
      await tx.delete(db_knowledgeCheck).where(eq(db_knowledgeCheck.id, updatedCheck.id))
      await insertKnowledgeCheck(user_id, updatedCheck)
    } catch (err) {
      await tx.rollback()
      console.error('[Rollback]: Error updating knowledge check:', err)
    }
  })
}
