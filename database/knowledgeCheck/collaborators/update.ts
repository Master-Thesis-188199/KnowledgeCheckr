import 'server-only'
import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_userContributesToKnowledgeCheck } from '@/database/drizzle'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function updateCollaborators(db: DrizzleDB, checkId: KnowledgeCheck['id'], newCollaborators: KnowledgeCheck['collaborators']) {
  await db.delete(db_userContributesToKnowledgeCheck).where(eq(db_userContributesToKnowledgeCheck.knowledgecheckId, checkId))

  if (newCollaborators.length === 0) return

  await db.insert(db_userContributesToKnowledgeCheck).values(newCollaborators.map((collabId) => ({ knowledgecheckId: checkId, userId: collabId })))
}
