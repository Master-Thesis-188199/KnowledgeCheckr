'use server'
import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userHasDoneKnowledgeCheck } from '@/database/drizzle'

export async function getCheckPracticeResultsByUserId({ knowledgeCheckId, userId }: {} & Pick<typeof db_userHasDoneKnowledgeCheck.$inferSelect, 'knowledgeCheckId' | 'userId'>) {
  const db = await getDatabase()
  const practiceAttempts = await db
    .select()
    .from(db_userHasDoneKnowledgeCheck)
    .where(and(eq(db_userHasDoneKnowledgeCheck.knowledgeCheckId, knowledgeCheckId), eq(db_userHasDoneKnowledgeCheck.userId, userId), eq(db_userHasDoneKnowledgeCheck.type, 'practice')))

  return practiceAttempts
}

export async function getKnowledgeCheckPracticeResults({ knowledgeCheckId }: {} & Pick<typeof db_userHasDoneKnowledgeCheck.$inferSelect, 'knowledgeCheckId'>) {
  const db = await getDatabase()
  const practiceAttempts = await db
    .select()
    .from(db_userHasDoneKnowledgeCheck)
    .where(and(eq(db_userHasDoneKnowledgeCheck.knowledgeCheckId, knowledgeCheckId), eq(db_userHasDoneKnowledgeCheck.type, 'practice')))

  return practiceAttempts
}
