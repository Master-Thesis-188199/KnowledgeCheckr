import { addMinutes, subMinutes } from 'date-fns'
import { getKnowledgeCheckExaminationAttempts } from '@/database/examination/select'
import getDummyUsers from '@/src/lib/dummy/getDummyUsers'
import randomRange from '@/src/lib/Shared/randomRange'
import { instantiateQuestionInput } from '@/src/schemas/UserQuestionInputSchema'

export default async function getDummyExamAttempts(count: number) {
  const users = await getDummyUsers(count)

  return Array.from({ length: count }, (_, i): Awaited<ReturnType<typeof getKnowledgeCheckExaminationAttempts>>[number] => ({
    id: Math.random() * 10000,
    startedAt: subMinutes(new Date(Date.now()), randomRange({ min: 1, max: 30, multiplyFactor: 25, rounded: true })).toString(),
    finishedAt: addMinutes(new Date(Date.now()), randomRange({ min: 1, max: 30, multiplyFactor: 25, rounded: true })).toString(),
    score: randomRange({ min: 0, max: 100, multiplyFactor: 100, rounded: true }),
    type: 'examination',
    results: Array.from({ length: 15 }, () => instantiateQuestionInput()),

    user: {
      ...users[i],
      createdAt: users[i].createdAt.toString(),
      updatedAt: users[i].updatedAt.toString(),
      emailVerified: users[i].emailVerified ? 1 : 0,
      isAnonymous: users[i].isAnonymous ?? null,
      image: users[i].image ?? null,
    },
  }))
}
