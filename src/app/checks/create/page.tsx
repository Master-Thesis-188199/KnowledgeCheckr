import QuestionsSection from '@/app/checks/create/QuestionsSection'
import { CreateCheckStoreProvider } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import PageHeading from '@/components/Shared/PageHeading'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import GeneralSection from '@/src/app/checks/create/GeneralSection'
import { SaveCreateCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import { Button } from '@/src/components/shadcn/button'
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
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
            { answer: 'Madrid', correct: false },
            { answer: 'Rome', correct: true },
          ],
          points: 5,
        },
        {
          id: getUUID(),
          type: 'multiple-choice',
          question: 'What is the capital of Greece?',
          category: 'Geography',
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
            { answer: 'Madrid', correct: false },
            { answer: 'Rome', correct: true },
          ],
          points: 5,
        },
        {
          id: getUUID(),
          type: 'multiple-choice',
          question: 'What is the capital of Australia?',
          category: 'Geography',
          answers: [
            { answer: 'Paris', correct: true },
            { answer: 'Berlin', correct: false },
            { answer: 'Madrid', correct: false },
            { answer: 'Rome', correct: true },
          ],
          points: 5,
        },
      ],
    })

    redirect('/checks')
  }

  return (
    <CreateCheckStoreProvider>
      <PageHeading title='Create KnowledgeCheck' />
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[repeat(auto-fill,minmax(680px,1fr))]'>
        <GeneralSection />
        <QuestionsSection />
        <SettingsSection />
        <Card className='h-60 break-inside-avoid' disableHoverStyles children={undefined} />
      </div>
      <form className='mt-4 flex justify-center gap-4'>
        <SaveCreateCheckButton />
        <Button variant='primary' className='' formAction={createDummyCheckAction}>
          Create Dummy Check
        </Button>
      </form>
      <div />
    </CreateCheckStoreProvider>
  )
}
