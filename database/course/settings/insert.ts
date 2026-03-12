'use server'

import { convertSettings } from '@/database/course/settings/transform'
import { DrizzleDB } from '@/database/Database'
import { db_courseSettings } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { Course } from '@/src/schemas/CourseSchema'

export default async function insertCourseSettings(db: DrizzleDB, { id, settings }: Pick<Course, 'id' | 'settings'>) {
  await requireAuthentication()

  const dbSettings = convertSettings('to-database', settings)

  const [{ id: insertId }] = await db
    .insert(db_courseSettings)
    .values({
      knowledgecheckId: id,
      ...dbSettings,
    })
    .$returningId()

  return insertId
}
