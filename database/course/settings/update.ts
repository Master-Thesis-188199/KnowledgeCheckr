import 'server-only'
import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_courseSettings } from '@/database/drizzle'
import { CourseSettings } from '@/src/schemas/CourseSettingsSchema'
import convertToDatabase from '@/src/schemas/utils/convertToDatabase'

export async function updateSettings(db: DrizzleDB, settings: CourseSettings) {
  // prevent the settings id from beingn accidentally updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...updates } = convertToDatabase(settings, db_courseSettings)

  return db.update(db_courseSettings).set(updates).where(eq(db_courseSettings.id, settings.id))
}
