import { describe, expect, it } from '@jest/globals'
import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_user } from '@/database/drizzle/schema'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

describe('Validate the order of inserted database elements', () => {
  it('Verify question and answer retrieval order is the same as insertion-order ', async () => {
    const db = await getDatabase()

    const [testUser] = await db.select().from(db_user).limit(1).where(eq(db_user.email, 'test@email.com'))
    expect(testUser).toBeDefined()

    const dummyCheck = Object.assign(instantiateKnowledgeCheck(), { owner_id: testUser.id })
    await insertKnowledgeCheck(testUser.id, dummyCheck)

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

    db.$client.end()
  })
})
