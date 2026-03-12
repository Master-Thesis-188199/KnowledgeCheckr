import { User } from 'better-auth'
import { and, eq } from 'drizzle-orm'
import { DatabaseOptions } from '@/database/course/type'
import getDatabase from '@/database/Database'
import { db_userHasDoneCourse } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/CourseSchema'

export async function getKnowledgeCheckUserExaminationAttempts(userId: User['id'], courseId: Course['id']) {
  const db = await getDatabase()

  const attempts = await db
    .select()
    .from(db_userHasDoneCourse)
    .where(and(eq(db_userHasDoneCourse.userId, userId), eq(db_userHasDoneCourse.knowledgeCheckId, courseId), eq(db_userHasDoneCourse.type, 'examination')))

  return attempts
}

export async function getExaminationAttemptById(attemptId: typeof db_userHasDoneCourse.$inferSelect.id, options?: DatabaseOptions) {
  const db = await getDatabase()

  const [attempt] = await db.query.db_userHasDoneCourse.findMany({
    columns: {
      knowledgeCheckId: false,
      userId: false,
    },
    with: {
      user: true,
    },
    where: eq(db_userHasDoneCourse.id, attemptId),
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
  })

  return attempt as typeof attempt | undefined
}

export async function getKnowledgeCheckExaminationAttempts(courseId: Course['id'], options?: DatabaseOptions) {
  const db = await getDatabase()

  const userAttempts = await db.query.db_userHasDoneCourse.findMany({
    columns: {
      knowledgeCheckId: false,
      userId: false,
    },
    with: {
      user: true,
    },
    where: and(eq(db_userHasDoneCourse.knowledgeCheckId, courseId), eq(db_userHasDoneCourse.type, 'examination')),
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
  })

  return userAttempts
}
