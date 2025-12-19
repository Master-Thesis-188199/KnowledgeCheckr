import 'server-only'
import { DrizzleDB } from '@/database/Database'
import { db_category } from '@/database/drizzle/schema'

export async function insertCategory(db: DrizzleDB, props: typeof db_category.$inferInsert) {
  const [{ id }] = await db.insert(db_category).values(props).$returningId()
  return id
}
