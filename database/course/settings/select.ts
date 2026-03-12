import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_courseSettings } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/CourseSchema'
import { instantiateCourseSettings, validateCourseSettings } from '@/src/schemas/CourseSettingsSchema'

export default async function getKnowledgeCheckSettingsById(id: Course['id']) {
  const db = await getDatabase()

  const settings = await db.select().from(db_courseSettings).where(eq(db_courseSettings.knowledgecheckId, id))

  return validateCourseSettings(settings?.at(0) ?? instantiateCourseSettings())
}
