'use server'

import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_course } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { Course } from '@/src/schemas/KnowledgeCheck'

export async function removeCourse({ courseId }: { courseId: Course['id'] }) {
  const {
    user: { id: userId },
  } = await requireAuthentication()

  const db = await getDatabase()

  const result = await db.delete(db_course).where(and(eq(db_course.id, courseId), eq(db_course.owner_id, userId)))
  return result[0].affectedRows > 0
}
