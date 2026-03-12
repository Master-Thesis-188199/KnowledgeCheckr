import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheckSettings } from '@/database/drizzle/schema'
import { Course } from '@/src/schemas/KnowledgeCheck'
import { instantiateCourseSettings, validateCourseSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'

export default async function getKnowledgeCheckSettingsById(id: Course['id']) {
  const db = await getDatabase()

  const settings = await db.select().from(db_knowledgeCheckSettings).where(eq(db_knowledgeCheckSettings.knowledgecheckId, id))

  return validateCourseSettings(settings?.at(0) ?? instantiateCourseSettings())
}
