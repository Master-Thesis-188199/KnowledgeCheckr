import { User } from 'better-auth'
import { eq } from 'drizzle-orm'
import { getDrizzleDatabase } from '@/database/Database'
import { db_knowledgeCheck } from '@/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function updateKnowledgeCheck(user_id: User['id'], updatedCheck: Pick<KnowledgeCheck, 'id'> & Partial<KnowledgeCheck>) {
  await requireAuthentication()

  const db = await getDrizzleDatabase()

  await db.transaction(async (tx) => {
    try {
      await tx.delete(db_knowledgeCheck).where(eq(db_knowledgeCheck.id, updatedCheck.id))
      await tx
        .update(db_knowledgeCheck)
        .set({
          ...updatedCheck,
          openDate: updatedCheck.openDate ? formatDatetime(updatedCheck.openDate) : undefined,
          closeDate: updatedCheck.closeDate ? formatDatetime(updatedCheck.closeDate) : undefined,
          createdAt: updatedCheck.createdAt ? formatDatetime(updatedCheck.createdAt) : undefined,
          updatedAt: updatedCheck.updatedAt ? formatDatetime(updatedCheck.updatedAt) : undefined,
        })
        .where(eq(db_knowledgeCheck.id, updatedCheck.id))
    } catch (err) {
      await tx.rollback()
      console.error('[Rollback]: Error updating knowledge check:', err)
    }
  })
}
