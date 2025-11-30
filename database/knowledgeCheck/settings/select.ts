import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheckSettings } from '@/database/drizzle/schema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { validateKnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'

export default async function getKnowledgeCheckSettingsById(id: KnowledgeCheck['id']) {
  const db = await getDatabase()

  const settings = await db.select().from(db_knowledgeCheckSettings).where(eq(db_knowledgeCheckSettings.knowledgecheckId, id))

  return validateKnowledgeCheckSettings(settings.at(0))
}
