import 'server-only'
import { and, eq } from 'drizzle-orm'
import getDatabase, { DrizzleDB } from '@/database/Database'
import { db_category } from '@/database/drizzle/schema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { Any } from '@/types'

export async function insertQuestionCategories(db: DrizzleDB | undefined, checkId: KnowledgeCheck['id'], categories: KnowledgeCheck['questionCategories']) {
  if (!db) db = await getDatabase()

  const insertedCategories: Awaited<ReturnType<typeof insertCategory>>[] = []

  for (const category of categories) {
    const insertion = await insertCategory(db, { ...category, knowledgecheckId: checkId })
    insertedCategories.push(insertion)
  }

  return insertedCategories
}

/**
 * This function inserts a new category that is associated to a given check. In case it tries to insert a duplicate category-name and knowledgeCheckId pair an error will be thrown.
 * @param db The database / db-transaction to use
 * @param props The category-props that are to be inserted
 * @returns The inserted data
 */
export async function insertCategory(db: DrizzleDB, props: typeof db_category.$inferInsert) {
  try {
    const [{ id }] = await db.insert(db_category).values(props).$returningId()
    return { ...props, id }
  } catch (error: Any) {
    const isDuplicateError = error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062 || error?.message?.includes('UNIQUE constraint')

    if (!isDuplicateError) {
      throw error
    }

    const [existingCategory] = await db
      .select()
      .from(db_category)
      .where(and(eq(db_category.name, props.name), eq(db_category.knowledgecheckId, props.knowledgecheckId)))

    return existingCategory
  }
}
