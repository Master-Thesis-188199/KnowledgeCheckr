'use server'

import { DrizzleDB } from '@/database/Database'
import { db_knowledgeCheckSettings } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function insertKnowledgeCheckSettings(db: DrizzleDB, { id, settings: { examination: examSettings, ...settings } }: Pick<KnowledgeCheck, 'id' | 'settings'>) {
  await requireAuthentication()

  const [{ id: insertId }] = await db
    .insert(db_knowledgeCheckSettings)
    .values({
      knowledgecheckId: id,
      ...settings,
      ...examSettings,
      allowAnonymous: examSettings.allowAnonymous ? 1 : 0,
      allowFreeNavigation: examSettings.allowFreeNavigation ? 1 : 0,
      shareAccessibility: settings.shareAccessibility ? 1 : 0,
    })
    .$returningId()

  return insertId
}
