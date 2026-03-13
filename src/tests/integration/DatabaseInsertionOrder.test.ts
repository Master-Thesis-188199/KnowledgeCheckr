import { describe, expect, it } from '@jest/globals'
import { eq } from 'drizzle-orm'
import insertCourse from '@/database/course/insert'
import { getCourseById } from '@/database/course/select'
import getDatabase from '@/database/Database'
import { db_course, db_user } from '@/database/drizzle/schema'
import prepareExaminationCourse from '@/src/lib/courses/[share_token]/prepareExaminationCourse'
import { Course, instantiateCourse } from '@/src/schemas/CourseSchema'
import { CourseSettings } from '@/src/schemas/CourseSettingsSchema'
import { instantiateDragDropQuestion, instantiateMultipleChoice, instantiateOpenQuestion, instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

let db: Awaited<ReturnType<typeof getDatabase>>

describe('Validate the order of inserted database elements', () => {
  beforeAll(async () => {
    db = await getDatabase()
  })

  it('Verify question and answer retrieval order is the same as insertion-order ', async () => {
    const [testUser] = await db.select().from(db_user).limit(1).where(eq(db_user.email, 'test@email.com'))
    expect(testUser).toBeDefined()

    const dummyCourse = Object.assign(instantiateCourse({ validate: true }), { owner_id: testUser.id })
    await insertCourse(dummyCourse)

    const [{ id }] = await db.select().from(db_course).where(eq(db_course.id, dummyCourse.id)).limit(1)
    expect(id).toBe(dummyCourse.id)

    const retrieved = await getCourseById(dummyCourse.id)
    expect(retrieved).toBeDefined()

    if (!retrieved) throw new Error('Retrieved course is undefined')

    expect(retrieved.questions.length).toBe(dummyCourse.questions.length)
    expect(retrieved.questions.map((q) => q.id).join('\n')).toBe(dummyCourse.questions.map((q) => q.id).join('\n'))
    expect(
      retrieved.questions
        .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
        .flatMap((q) => q.answers.map((a) => a.id))
        .join('\n'),
    ).toBe(
      dummyCourse.questions
        .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
        .flatMap((q) => q.answers.map((a) => a.id))
        .join('\n'),
    )
  })

  it.each(['create-order', 'random'] as Array<CourseSettings['examination']['questionOrder']>)(
    "Ensure that `prepareExaminationCourse` shuffled questions & answers do/don't match input order based on order-settings",
    async (order) => {
      const course: Course = {
        ...instantiateCourse(),

        questions: [
          { ...instantiateSingleChoice(), question: 'This is a single-choice question' },
          { ...instantiateMultipleChoice(), question: 'This is a multiple-choice question' },
          { ...instantiateDragDropQuestion(), question: 'This is a drag-drop question' },
          { ...instantiateOpenQuestion(), question: 'This is an open-question question' },
        ],
      }

      course.settings.examination.questionOrder = order
      course.settings.examination.answerOrder = order

      for (let i = 0; i < 10; i++) {
        const preparedCourse = await prepareExaminationCourse(course)

        if (order === 'random') {
          expect(preparedCourse.questions.map((q) => q.id).join(',')).not.toBe(course.questions.map((q) => q.id).join(','))

          //* validate answer-order is random
          expect(
            preparedCourse.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          ).not.toBe(
            course.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          )
        } else {
          expect(preparedCourse.questions.map((q) => q.id).join(',')).toBe(course.questions.map((q) => q.id).join(','))
          //* validate answer-order is not random
          expect(
            preparedCourse.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          ).toBe(
            course.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          )
        }
      }
    },
  )

  afterAll(async () => {
    // Clean up test data
    db.$client.end()
  })
})
