import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userContributesToKnowledgeCheck } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/KnowledgeCheck'

export async function getKnowledgeCheckCollaborators(courseId: Course['id']) {
  const db = await getDatabase()

  return await db.select({ userId: db_userContributesToKnowledgeCheck.userId }).from(db_userContributesToKnowledgeCheck).where(eq(db_userContributesToKnowledgeCheck.knowledgecheckId, courseId))
}
