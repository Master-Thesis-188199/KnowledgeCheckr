import { describe, expect, it } from '@jest/globals'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_user } from '@/database/drizzle/schema'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import prepareExaminationCheck from '@/src/lib/checks/[share_token]/prepareExminationCheck'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { KnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { instantiateDragDropQuestion, instantiateMultipleChoice, instantiateOpenQuestion, instantiateSingleChoice } from '@/src/schemas/QuestionSchema'

let db: Awaited<ReturnType<typeof getDatabase>>

describe('Validate the order of inserted database elements', () => {
  beforeAll(async () => {
    db = await getDatabase()
  })

  it('Verify question and answer retrieval order is the same as insertion-order ', async () => {
    const [testUser] = await db.select().from(db_user).limit(1).where(eq(db_user.email, 'test@email.com'))
    expect(testUser).toBeDefined()

    const dummyCheck = Object.assign(instantiateKnowledgeCheck({ validate: true }), { owner_id: testUser.id })
    await insertKnowledgeCheck(dummyCheck)

    const [{ id }] = await db.select().from(db_knowledgeCheck).where(eq(db_knowledgeCheck.id, dummyCheck.id)).limit(1)
    expect(id).toBe(dummyCheck.id)

    const retrieved = await getKnowledgeCheckById(dummyCheck.id)
    expect(retrieved).toBeDefined()

    if (!retrieved) throw new Error('Retrieved knowledge check is undefined')

    expect(retrieved.questions.length).toBe(dummyCheck.questions.length)
    expect(retrieved.questions.map((q) => q.id).join('\n')).toBe(dummyCheck.questions.map((q) => q.id).join('\n'))
    expect(
      retrieved.questions
        .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
        .flatMap((q) => q.answers.map((a) => a.id))
        .join('\n'),
    ).toBe(
      dummyCheck.questions
        .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
        .flatMap((q) => q.answers.map((a) => a.id))
        .join('\n'),
    )
  })

  it.each(['create-order', 'random'] as Array<KnowledgeCheckSettings['examination']['questionOrder']>)(
    "Ensure that `prepareExaminationCheck` shuffled questions & answers do/don't match input order based on order-settings",
    async (order) => {
      const check: KnowledgeCheck = {
        ...instantiateKnowledgeCheck(),

        questions: [
          { ...instantiateSingleChoice(), question: 'This is a single-choice question' },
          { ...instantiateMultipleChoice(), question: 'This is a multiple-choice question' },
          { ...instantiateDragDropQuestion(), question: 'This is a drag-drop question' },
          { ...instantiateOpenQuestion(), question: 'This is an open-question question' },
        ],
      }

      check.settings.examination.questionOrder = order
      check.settings.examination.answerOrder = order

      for (let i = 0; i < 10; i++) {
        const preparedCheck = await prepareExaminationCheck(check)

        if (order === 'random') {
          expect(preparedCheck.questions.map((q) => q.id).join(',')).not.toBe(check.questions.map((q) => q.id).join(','))

          //* validate answer-order is random
          expect(
            preparedCheck.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          ).not.toBe(
            check.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          )
        } else {
          expect(preparedCheck.questions.map((q) => q.id).join(',')).toBe(check.questions.map((q) => q.id).join(','))
          //* validate answer-order is not random
          expect(
            preparedCheck.questions
              .filter((q) => q.type === 'single-choice' || q.type === 'multiple-choice' || q.type === 'drag-drop')
              .flatMap((q) => q.answers.map((a) => a.id))
              .join(','),
          ).toBe(
            check.questions
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
