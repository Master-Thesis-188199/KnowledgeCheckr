import { DrizzleDB } from '@/database/Database'
import { db_userContributesToCourse } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/CourseSchema'

export async function insertCollaboratorsToCourse(db: DrizzleDB, courseId: Course['id'], collaborators: Course['collaborators']) {
  if (collaborators.length === 0) return

  const values: (typeof db_userContributesToCourse.$inferInsert)[] = collaborators.map((collaboratorId) => ({ knowledgecheckId: courseId, userId: collaboratorId }))

  await db.insert(db_userContributesToCourse).values(values)
}
