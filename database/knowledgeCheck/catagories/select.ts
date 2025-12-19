import 'server-only'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_category } from '@/database/drizzle/schema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function getCategoriesByCheckId(knowledgeCheckId: KnowledgeCheck['id']) {
  const db = await getDatabase()

  return await db.select().from(db_category).where(eq(db_category.knowledgecheckId, knowledgeCheckId))
}
