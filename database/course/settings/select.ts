import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_courseSettings } from '@/database/drizzle/schema'
import { getI18n } from '@/src/i18n/server-localization'
import { Course } from '@/src/schemas/CourseSchema'
import { instantiateCourseSettings, validateCourseSettings } from '@/src/schemas/CourseSettingsSchema'

export default async function getCourseSettingsById(id: Course['id']) {
  const t = await getI18n()
  const db = await getDatabase()

  const settings = await db.select().from(db_courseSettings).where(eq(db_courseSettings.knowledgecheckId, id))

  return validateCourseSettings(t, settings?.at(0) ?? instantiateCourseSettings(t))
}
