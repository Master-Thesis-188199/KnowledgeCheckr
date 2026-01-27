import { eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_category } from '@/database/drizzle'
import { insertQuestionCategories } from '@/database/knowledgeCheck/catagories/insert'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function updateCategories(db: DrizzleDB, checkId: KnowledgeCheck['id'], categories: KnowledgeCheck['questionCategories']) {
  await db.delete(db_category).where(eq(db_category.knowledgecheckId, checkId))

  if (categories.length === 0) return

  await insertQuestionCategories(db, checkId, categories)
}
