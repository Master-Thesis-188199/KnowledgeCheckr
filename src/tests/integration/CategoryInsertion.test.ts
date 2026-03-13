import { describe, expect, it } from '@jest/globals'
import { eq } from 'drizzle-orm'
import insertCourse from '@/database/course/insert'
import { getCourseById } from '@/database/course/select'
import getDatabase from '@/database/Database'
import { db_user } from '@/database/drizzle/schema'
import { instantiateCategory } from '@/src/schemas/CategorySchema'
import { instantiateCourse } from '@/src/schemas/CourseSchema'
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

  it.each([{ categories: ['general', 'categoryA', 'categoryB'] }, { categories: ['general'] }] as const)('Ensure course categories are inserted properly', async ({ categories }) => {
    const dummyCourse = instantiateCourse()

    dummyCourse.owner_id = testUser.id
    dummyCourse.questionCategories = []
    dummyCourse.questions = []
    for (const category of categories) {
      dummyCourse.questionCategories.push({ ...instantiateCategory(), name: category })
      dummyCourse.questions.push({ ...instantiateSingleChoice(), category: category }, { ...instantiateMultipleChoice(), category: category })
    }

    await insertCourse(dummyCourse)

    //* Ensure category was inserted and retrieved correctly
    const course = await getCourseById(dummyCourse.id)
    expect(course?.questionCategories).toEqual(expect.arrayContaining(dummyCourse?.questionCategories))
  })

  afterAll(async () => {
    // Clean up test data
    db.$client.end()
  })
})
