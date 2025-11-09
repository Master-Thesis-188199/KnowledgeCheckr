import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_user } from '@/database/drizzle/schema'

dotenv.config()

async function cleanupTestData() {
  const db = await getDatabase()

  const testEmail = 'test@email.com'

  const [{ userId }] = await db.select({ userId: db_user.id }).from(db_user).where(eq(db_user.email, testEmail)).limit(1)
  await db.delete(db_knowledgeCheck).where(eq(db_knowledgeCheck.owner_id, userId))

  console.log(`Deleted all KnowledgeChecks created by the test-user with the email ${testEmail}`)

  await db.$client.destroy()
}

cleanupTestData()
