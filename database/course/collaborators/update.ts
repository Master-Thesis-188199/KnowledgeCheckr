import 'server-only'
import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_userContributesToKnowledgeCheck } from '@/database/drizzle'
import { Course } from '@/src/schemas/KnowledgeCheck'

export async function updateCollaborators(db: DrizzleDB, courseId: Course['id'], newCollaborators: Course['collaborators']) {
  await db.delete(db_userContributesToKnowledgeCheck).where(eq(db_userContributesToKnowledgeCheck.knowledgecheckId, courseId))

  if (newCollaborators.length === 0) return

  await db.insert(db_userContributesToKnowledgeCheck).values(newCollaborators.map((collabId) => ({ knowledgecheckId: courseId, userId: collabId })))
}
