import QuestionsSection from '@/app/checks/create/QuestionsSection'
import { CreateCheckStoreProvider } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import PageHeading from '@/components/Shared/PageHeading'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { SaveCreateCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import { Button } from '@/src/components/shadcn/button'
import { Textarea } from '@/src/components/shadcn/textarea'
import Input from '@/src/components/Shared/form/Input'
import { getServerSession } from '@/src/lib/auth/server'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { unauthorized } from 'next/navigation'
import { ComponentType, InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export default async function CreateCheckPage() {
  const { user } = await getServerSession()
  if (!user) {
    return unauthorized()
  }

  const createDummyCheckAction = async () => {
    'use server'
    insertKnowledgeCheck(user.id, {
      id: getUUID(),
      name: '',
      description: '',
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
  }

  return (
    <CreateCheckStoreProvider>
      <PageHeading title='Create KnowledgeCheck' />
      <div className='columns-xl gap-12 space-y-12'>
        <Card className='@container flex flex-col gap-8 p-3' disableHoverStyles>
          <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
            <div className='flex items-center justify-between'>
              <h2 className=''>General Information</h2>
            </div>
          </div>
          <div className='grid grid-cols-[auto_1fr] items-center gap-9 gap-x-7 p-2'>
            <InputGroup label='Name' placeholder='Enter the name of your knowledge check' />
            <InputGroup label='Description' className='min-h-20 resize-none' as={Textarea} placeholder='Describe the concept of your knowledge check using a few words.' />
            <InputGroup
              label='Deadline'
              type='date'
              defaultValue={new Date(Date.now())
                .toLocaleDateString('de')
                .split('.')
                .reverse()
                .map((el) => (el.length < 2 ? '0' + el : el))
                .join('-')}
              className='text-sm text-neutral-500 dark:text-neutral-400'
            />
            <InputGroup label='Administrators' />
          </div>
        </Card>
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

function InputGroup<E extends ComponentType>({ label, as, ...props }: { label: string; as?: E } & InputHTMLAttributes<HTMLInputElement>) {
  const Element = as || Input

  return (
    <>
      <label className='text-neutral-600 dark:text-neutral-400'>{label}</label>
      <Element
        placeholder='Enter some text'
        {...props}
        className={twMerge(
          'rounded-md px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
          props.className,
        )}
      />
    </>
  )
}
