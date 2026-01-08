'use server'

import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function removeKnowledgeCheck({ checkId }: { checkId: KnowledgeCheck['id'] }) {
  const {
    user: { id: userId },
  } = await requireAuthentication()

  const db = await getDatabase()

  const result = await db.delete(db_knowledgeCheck).where(and(eq(db_knowledgeCheck.id, checkId), eq(db_knowledgeCheck.owner_id, userId)))
  return result[0].affectedRows > 0
}
