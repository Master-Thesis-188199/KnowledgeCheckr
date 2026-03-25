import 'server-only'
import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_courseSettings } from '@/database/drizzle'
import { CourseSettings, CourseSettingsSchema } from '@/src/schemas/CourseSettingsSchema'
import createConvertToDatabase from '@/src/schemas/utils/createConvertToDatabase'

export async function updateSettings(db: DrizzleDB, settings: CourseSettings) {
  const convertTo = createConvertToDatabase(CourseSettingsSchema, db_courseSettings)

  // prevent the settings id from beingn accidentally updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...updates } = convertTo(settings)

  return db.update(db_courseSettings).set(updates).where(eq(db_courseSettings.id, settings.id))
}
