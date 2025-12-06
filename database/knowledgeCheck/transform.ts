import { db_knowledgeCheck } from '@/database/drizzle/schema'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function convertToDatabaseKnowledgeCheck(knowledgeCheck: KnowledgeCheck): typeof db_knowledgeCheck.$inferInsert {
  if (!knowledgeCheck.owner_id) {
    console.warn('[convertToDatabaseKnowledgeCheck]: knowledgeCheck.owner_id is missing, assigning "missing-owner-id" as fallback value!')
  }

  return {
    ...knowledgeCheck,
    openDate: formatDatetime(knowledgeCheck.openDate),
    createdAt: knowledgeCheck.createdAt ? formatDatetime(knowledgeCheck.createdAt) : undefined,
    updatedAt: knowledgeCheck.updatedAt ? formatDatetime(knowledgeCheck.updatedAt) : undefined,
    closeDate: knowledgeCheck.closeDate ? formatDatetime(knowledgeCheck.closeDate) : undefined,
    owner_id: knowledgeCheck.owner_id ?? 'missing-owner-id',
  }
}
