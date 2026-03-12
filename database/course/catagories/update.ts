import { eq } from 'drizzle-orm'
import { insertQuestionCategories } from '@/database/course/catagories/insert'
import { DrizzleDB } from '@/database/Database'
import { db_category } from '@/database/drizzle'
import { Course } from '@/src/schemas/KnowledgeCheck'

export async function updateCategories(db: DrizzleDB, courseId: Course['id'], categories: Course['questionCategories']) {
  await db.delete(db_category).where(eq(db_category.knowledgecheckId, courseId))

  if (categories.length === 0) return

  await insertQuestionCategories(db, courseId, categories)
}
