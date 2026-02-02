import { User } from 'better-auth'
import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userHasDoneKnowledgeCheck } from '@/database/drizzle/schema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function getKnowledgeCheckUserExaminationAttempts(userId: User['id'], checkId: KnowledgeCheck['id']) {
  const db = await getDatabase()

  const attempts = await db
    .select()
    .from(db_userHasDoneKnowledgeCheck)
    .where(and(eq(db_userHasDoneKnowledgeCheck.userId, userId), eq(db_userHasDoneKnowledgeCheck.knowledgeCheckId, checkId), eq(db_userHasDoneKnowledgeCheck.type, 'examination')))

  return attempts
}
