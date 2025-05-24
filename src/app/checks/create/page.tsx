import QuestionsSection from '@/app/checks/create/QuestionsSection'
import { CreateCheckStoreProvider } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import PageHeading from '@/components/Shared/PageHeading'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import GeneralSection from '@/src/app/checks/create/GeneralSection'
import { SaveCreateCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import { Button } from '@/src/components/shadcn/button'
import { getServerSession } from '@/src/lib/auth/server'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'
import { redirect, unauthorized } from 'next/navigation'

export default async function CreateCheckPage() {
  const { user } = await getServerSession()
  if (!user) {
    return unauthorized()
  }

  const createDummyCheckAction = async () => {
    'use server'
    const { user } = await getServerSession()
    if (!user) unauthorized()

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
      openDate: new Date(Date.now()).toLocaleDateString('de'),
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
      <div className='columns-xl gap-12 space-y-12'>
        <GeneralSection />
        <Card disableHoverStyles className='break-inside-avoid'>
          <h2 className='text-lg'>Settings</h2>
          <div className='h-[500px]'></div>
        </Card>
        <QuestionsSection />
        <Card className='h-60 break-inside-avoid' children={<></>} disableHoverStyles></Card>
      </div>
      <form className='mt-4 flex justify-center gap-4'>
        <SaveCreateCheckButton user_id={user.id} />
        <Button variant='primary' className='' formAction={createDummyCheckAction}>
          Create Dummy Check
        </Button>
      </form>
      <div />
    </CreateCheckStoreProvider>
  )
}
