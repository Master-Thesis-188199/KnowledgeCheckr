import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userContributesToKnowledgeCheck } from '@/database/drizzle/schema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function getKnowledgeCheckCollaborators(checkId: KnowledgeCheck['id']) {
  const db = await getDatabase()

  return await db.select({ userId: db_userContributesToKnowledgeCheck.userId }).from(db_userContributesToKnowledgeCheck).where(eq(db_userContributesToKnowledgeCheck.knowledgecheckId, checkId))
}
