'use server'

import { DrizzleDB } from '@/database/Database'
import { db_knowledgeCheckSettings } from '@/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Any } from '@/types'

export default async function insertKnowledgeCheckSettings(db: DrizzleDB, settings: Any, check_id: KnowledgeCheck['id']) {
  await requireAuthentication()

  const [{ id }] = await db
    .insert(db_knowledgeCheckSettings)
    .values({
      id: getUUID(),
      knowledgecheckId: check_id,
      allowAnonymous: 1,
      randomizeQuestions: 1,
    })
    .$returningId()

  return id
}
