import 'server-only'
import { and, eq } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_category } from '@/database/drizzle/schema'

export async function insertCategory(db: DrizzleDB, props: typeof db_category.$inferInsert) {
  const duplicates = await db
    .select()
    .from(db_category)
    .where(and(eq(db_category.knowledgecheckId, props.knowledgecheckId), eq(db_category.name, props.name)))
    .limit(1)

  if (duplicates.length > 0) return duplicates[0].id

  const [{ id }] = await db.insert(db_category).values(props).$returningId()
  return id
}
