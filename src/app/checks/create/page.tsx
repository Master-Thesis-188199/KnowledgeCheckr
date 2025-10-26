import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { ConfigureKnowledgeCheck } from '@/src/components/checks/ConfigureKnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'
import { redirect } from 'next/navigation'

export default async function CreateCheckPage() {
  await requireAuthentication()

  const createDummyCheckAction = async () => {
    'use server'
    const { user } = await requireAuthentication()

    insertKnowledgeCheck(user.id, {
      id: getUUID(),
      name: (Math.random() * 100 + 10)
        .toPrecision(20)
        .replace(/\./g, '')
        .split('')
        .map((char) => String.fromCharCode(65 + parseInt(char)).toLowerCase())
        .join(''),
      description: lorem
        .split(' ')
        .slice(0, Math.random() * 100 + 10)
        .join(' '),
      share_key: null,
      closeDate: null,
      difficulty: 2,
      openDate: new Date(Date.now()),
      questionCategories: [{ id: getUUID(), name: 'Geography', skipOnMissingPrequisite: false }],
      questions: [
        {
          id: getUUID(),
          type: 'multiple-choice',
          question: 'What is the capital of France?',
          category: 'Geography',
          answers: [
            { id: getUUID(), answer: 'Paris', correct: true },
            { id: getUUID(), answer: 'Berlin', correct: false },
            { id: getUUID(), answer: 'Madrid', correct: false },
            { id: getUUID(), answer: 'Rome', correct: true },
          ],
          points: 5,
        },
        {
          id: getUUID(),
          type: 'multiple-choice',
          question: 'What is the capital of Greece?',
          category: 'Geography',
          answers: [
            { id: getUUID(), answer: 'Paris', correct: true },
            { id: getUUID(), answer: 'Berlin', correct: false },
            { id: getUUID(), answer: 'Madrid', correct: false },
            { id: getUUID(), answer: 'Rome', correct: true },
          ],
          points: 5,
        },
        {
          id: getUUID(),
          type: 'multiple-choice',
          question: 'What is the capital of Australia?',
          category: 'Geography',
          answers: [
            { id: getUUID(), answer: 'Paris', correct: true },
            { id: getUUID(), answer: 'Berlin', correct: false },
            { id: getUUID(), answer: 'Madrid', correct: false },
            { id: getUUID(), answer: 'Rome', correct: true },
          ],
          points: 5,
        },
      ],
    })

    redirect('/checks')
  }

  return <ConfigureKnowledgeCheck mode='create' />
}
