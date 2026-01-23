import 'server-only'
import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_knowledgeCheckSettings } from '@/database/drizzle'
import { KnowledgeCheckSettings, KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import createConvertToDatabase from '@/src/schemas/utils/createConvertToDatabase'

export async function updateSettings(db: DrizzleDB, settings: KnowledgeCheckSettings) {
  const convertTo = createConvertToDatabase(KnowledgeCheckSettingsSchema, db_knowledgeCheckSettings)

  // prevent the settings id from beingn accidentally updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...updates } = convertTo(settings)

  return db.update(db_knowledgeCheckSettings).set(updates).where(eq(db_knowledgeCheckSettings.id, settings.id))
}
