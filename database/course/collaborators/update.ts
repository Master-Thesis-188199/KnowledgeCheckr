import 'server-only'
import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_userContributesToCourse } from '@/database/drizzle'
import { Course } from '@/src/schemas/KnowledgeCheck'

export async function updateCollaborators(db: DrizzleDB, courseId: Course['id'], newCollaborators: Course['collaborators']) {
  await db.delete(db_userContributesToCourse).where(eq(db_userContributesToCourse.knowledgecheckId, courseId))

  if (newCollaborators.length === 0) return

  await db.insert(db_userContributesToCourse).values(newCollaborators.map((collabId) => ({ knowledgecheckId: courseId, userId: collabId })))
}
