import { describe, expect, it } from '@jest/globals'
import { eq } from 'drizzle-orm'
import insertCourse from '@/database/course/insert'
import { getCourseById } from '@/database/course/select'
import getDatabase from '@/database/Database'
import { db_user } from '@/database/drizzle/schema'
import { instantiateCategory } from '@/src/schemas/CategorySchema'
import { instantiateCourse } from '@/src/schemas/KnowledgeCheck'
import { instantiateMultipleChoice, instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

let db: Awaited<ReturnType<typeof getDatabase>>
let testUser: typeof db_user.$inferSelect

describe('Category Insertion / Retrieval Suite: ', () => {
  beforeAll(async () => {
    db = await getDatabase()

    const [tUser] = await db.select().from(db_user).limit(1).where(eq(db_user.email, 'test@email.com'))
    testUser = tUser
    expect(testUser).toBeDefined()
  })

  it.each([{ categories: ['general', 'categoryA', 'categoryB'] }, { categories: ['general'] }] as const)('Ensure knowledgeCheck categories are inserted properly', async ({ categories }) => {
    const dummyCheck = instantiateCourse()

    dummyCheck.owner_id = testUser.id
    dummyCheck.questionCategories = []
    dummyCheck.questions = []
    for (const category of categories) {
      dummyCheck.questionCategories.push({ ...instantiateCategory(), name: category })
      dummyCheck.questions.push({ ...instantiateSingleChoice(), category: category }, { ...instantiateMultipleChoice(), category: category })
    }

    await insertCourse(dummyCheck)

    //* Ensure category was inserted and retrieved correctly
    const check = await getCourseById(dummyCheck.id)
    expect(check?.questionCategories).toEqual(expect.arrayContaining(dummyCheck?.questionCategories))
  })

  afterAll(async () => {
    // Clean up test data
    db.$client.end()
  })
})
