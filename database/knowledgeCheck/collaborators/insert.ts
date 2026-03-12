import { DrizzleDB } from '@/database/Database'
import { db_userContributesToKnowledgeCheck } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/KnowledgeCheck'

export async function insertCollaboratorsToKnowledgeCheck(db: DrizzleDB, checkId: Course['id'], collaborators: Course['collaborators']) {
  if (collaborators.length === 0) return

  const values: (typeof db_userContributesToKnowledgeCheck.$inferInsert)[] = collaborators.map((collaboratorId) => ({ knowledgecheckId: checkId, userId: collaboratorId }))

  await db.insert(db_userContributesToKnowledgeCheck).values(values)
}
