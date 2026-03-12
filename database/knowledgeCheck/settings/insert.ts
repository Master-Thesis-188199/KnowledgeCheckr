'use server'

import { DrizzleDB } from '@/database/Database'
import { db_knowledgeCheckSettings } from '@/database/drizzle/schema'
import { convertSettings } from '@/database/knowledgeCheck/settings/transform'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { Course } from '@/src/schemas/KnowledgeCheck'

export default async function insertKnowledgeCheckSettings(db: DrizzleDB, { id, settings }: Pick<Course, 'id' | 'settings'>) {
  await requireAuthentication()

  const dbSettings = convertSettings('to-database', settings)

  const [{ id: insertId }] = await db
    .insert(db_knowledgeCheckSettings)
    .values({
      knowledgecheckId: id,
      ...dbSettings,
    })
    .$returningId()

  return insertId
}
