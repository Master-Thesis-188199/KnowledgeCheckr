'use server'

import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function saveAction({ user_id, check }: { user_id: string; check: KnowledgeCheck }) {
  await insertKnowledgeCheck(user_id, check)
}
