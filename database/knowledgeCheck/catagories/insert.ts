import 'server-only'
import { DrizzleDB } from '@/database/Database'
import { db_category } from '@/database/drizzle/schema'

/**
 * This function inserts a new category that is associated to a given check. In case it tries to insert a duplicate category-name and knowledgeCheckId pair an error will be thrown.
 * @param db The database / db-transaction to use
 * @param props The category-props that are to be inserted
 * @returns The inserted data
 */
export async function insertCategory(db: DrizzleDB, props: typeof db_category.$inferInsert): Promise<typeof db_category.$inferInsert | never> {
  const [{ id }] = await db.insert(db_category).values(props).$returningId()
  return { ...props, id }
}
