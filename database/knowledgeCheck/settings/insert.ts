'use server'

import { DBConnection } from '@/database/Database'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Any } from '@/types'

export default async function insertKnowledgeCheckSettings(db: DBConnection, settings: Any, check_id: KnowledgeCheck['id']) {
  return (await db.insert('INSERT INTO KnowledgeCheck_Settings (id, knowledgecheck_id, allow_anonymous, randomize_questions) Values (?, ?, ?, ?);', [getUUID(), check_id, 1, 1])).id
}
