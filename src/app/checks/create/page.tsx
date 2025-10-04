import QuestionsSection from '@/app/checks/create/QuestionsSection'
import { CreateCheckStoreProvider } from '@/components/check/create/CreateCheckProvider'
import PageHeading from '@/components/Shared/PageHeading'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import GeneralSection from '@/src/app/checks/create/GeneralSection'
import { SaveCreateCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import { OverviewSection } from '@/src/components/check/create/(sections)/OverviewSection'
import { Button } from '@/src/components/shadcn/button'
import { MultiStageBackButton, MultiStageNextButton } from '@/src/components/Shared/MultiStageProgress/MultiStageNavigationButtons'
import { MultiStageProgressBar } from '@/src/components/Shared/MultiStageProgress/MultiStageProgressBar'
import { MultiStageStoreProvider } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { MutliStageRenderer } from '@/src/components/Shared/MultiStageProgress/MutliStageRenderer'
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
      <MultiStageStoreProvider
        initialStoreProps={{
          stages: [
            { stage: 1, title: 'Basic Information' },
            { stage: 2, title: 'Questions' },
            { stage: 3, title: 'Settings' },
            { stage: 4, title: 'Conclusion' },
          ],
        }}>
        <PageHeading title='Create KnowledgeCheck' />
        <MultiStageProgressBar className='-mt-2 mb-12' />

        <div className='mx-[1.5%] grid grid-cols-1 gap-8'>
          <MutliStageRenderer stage={1}>
            <GeneralSection />
          </MutliStageRenderer>
          <MutliStageRenderer stage={2}>
            <QuestionsSection />
          </MutliStageRenderer>

          <MutliStageRenderer stage={3}>
            <SettingsSection />
          </MutliStageRenderer>

          <MutliStageRenderer stage={4}>
            <OverviewSection />
          </MutliStageRenderer>
        </div>
        <div className='mx-[1.5%] mt-4 flex justify-between'>
          <MultiStageBackButton variant='outline' children='Back' />
          <MultiStageNextButton variant='primary' children='Next' />
        </div>
        <MutliStageRenderer stage={4}>
          <form className='mt-4 flex justify-center gap-4'>
            <SaveCreateCheckButton />
            <Button variant='primary' className='' formAction={createDummyCheckAction}>
              Create Dummy Check
            </Button>
          </form>
        </MutliStageRenderer>
        <div />
      </MultiStageStoreProvider>
    </CreateCheckStoreProvider>
  )
}
