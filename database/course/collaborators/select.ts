import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userContributesToCourse } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/CourseSchema'

export async function getKnowledgeCheckCollaborators(courseId: Course['id']) {
  const db = await getDatabase()

  return await db.select({ userId: db_userContributesToCourse.userId }).from(db_userContributesToCourse).where(eq(db_userContributesToCourse.knowledgecheckId, courseId))
}
