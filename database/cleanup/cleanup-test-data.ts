import * as dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import deleteUser from '@/database/cleanup/deleteUser'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_user } from '@/database/drizzle/schema'

dotenv.config()

async function cleanupTestData() {
  const db = await getDatabase()
  const testEmail = 'test@email.com'

  console.log()
  console.log(String('-').repeat(30))
  console.log()
  console.log('Cleaning up test-data...')
  console.log()

  const users = await db.select({ userId: db_user.id }).from(db_user).where(eq(db_user.email, testEmail)).limit(1)

  if (users.length === 0 || !users.at(0)?.userId) {
    console.error(`No test-user found matching email: '${testEmail}'`)
    process.exit(1)
  }

  await db.delete(db_knowledgeCheck).where(eq(db_knowledgeCheck.owner_id, users.at(0)!.userId))

  console.log(`Deleted all KnowledgeChecks created by the test-user with the email ${testEmail}`)

  await deleteUser({ email: 'e2e.user@example.test' })
  await deleteUser({ name: 'Anonymous' }, { limit: -1 })

  await db.$client.destroy()
}

cleanupTestData()
