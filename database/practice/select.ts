'use server'
import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userHasDoneCourse } from '@/database/drizzle'

export async function getCheckPracticeResultsByUserId({ knowledgeCheckId, userId }: {} & Pick<typeof db_userHasDoneCourse.$inferSelect, 'knowledgeCheckId' | 'userId'>) {
  const db = await getDatabase()
  const practiceAttempts = await db
    .select()
    .from(db_userHasDoneCourse)
    .where(and(eq(db_userHasDoneCourse.knowledgeCheckId, knowledgeCheckId), eq(db_userHasDoneCourse.userId, userId), eq(db_userHasDoneCourse.type, 'practice')))

  return practiceAttempts
}

export async function getKnowledgeCheckPracticeResults({ knowledgeCheckId }: {} & Pick<typeof db_userHasDoneCourse.$inferSelect, 'knowledgeCheckId'>) {
  const db = await getDatabase()
  const practiceAttempts = await db
    .select()
    .from(db_userHasDoneCourse)
    .where(and(eq(db_userHasDoneCourse.knowledgeCheckId, knowledgeCheckId), eq(db_userHasDoneCourse.type, 'practice')))

  return practiceAttempts
}
