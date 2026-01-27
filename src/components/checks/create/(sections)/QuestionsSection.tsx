'use client'

import { Folder, Info, Pen, Plus, Trash2 } from 'lucide-react'
import { useCheckStore } from '@/components/checks/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import { cn } from '@/lib/Shared/utils'
import CreateQuestionDialog from '@/src/components/checks/create/(create-question)/CreateQuestionDialog'
import { Button } from '@/src/components/shadcn/button'
import { useScopedI18n } from '@/src/i18n/client-localization'
export default function QuestionsSection() {
  const t = useScopedI18n('Checks.Create.QuestionSection')
  const { questions } = useCheckStore((state) => state)

  return (
    <Card disableInteractions className='question-section flex break-inside-avoid flex-col p-3'>
      <div className='header -mx-3 -mt-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>{t('title')}</h2>
        </div>
      </div>
      <div className='questions'>
        <EmptyQuestionsStatus show={questions.length === 0} />
        <RenderCreatedQuestions show={questions.length > 0} />
      </div>
      <div className='flex justify-center gap-8'>
        <CreateQuestionDialog>
          <Button variant='outline' size='lg'>
            <Plus className='size-5' />
            {t('create_button')}
          </Button>
        </CreateQuestionDialog>
      </div>
    </Card>
  )
}

function EmptyQuestionsStatus({ show }: { show: boolean }) {
  const t = useScopedI18n('Checks.Create.QuestionSection')

  return (
    <div className={cn('flex h-60 flex-col items-center justify-center gap-6', !show && 'hidden')}>
      <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
      <span className='text-center tracking-wide text-balance text-neutral-500 dark:text-neutral-400'>{t('no_questions_info')}</span>
    </div>
  )
}

function RenderCreatedQuestions({ show }: { show: boolean }) {
  const { questions, removeQuestion } = useCheckStore((state) => state)
  const tQuestion = useScopedI18n('Shared.Question')
  const t = useScopedI18n('Checks.Create.QuestionSection.QuestionCard')

  if (!show) return null

  return (
    <div className={cn('my-4 grid grid-cols-1 gap-6')}>
      {questions.map((question, i) => (
        <Card
          data-question-id={question.id}
          data-question={question.question}
          key={i + question.id}
          className={cn(
            'question relative flex gap-3 p-2 first:mt-3 hover:bg-none',
            // increase space to previous element / section-header when accessibility badge is displayed
            question.accessibility !== 'all' && 'mt-2 first:mt-6',
          )}>
          <div
            title={question.accessibility === 'all' ? undefined : question.accessibility === 'exam-only' ? 'Excluded from practice!' : 'Excluded from examinations!'}
            className={cn(
              'question-accessibility',
              'absolute -top-3 left-0 rounded-md px-1.5 py-0.5 text-xs capitalize italic shadow-md ring-1',
              'bg-neutral-200 text-neutral-600 shadow-neutral-300 ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-300/90 dark:shadow-neutral-800 dark:ring-neutral-600',
              question.accessibility === 'all' && 'hidden',
            )}>
            {tQuestion(`accessibility.${question.accessibility}`)}
          </div>
          <div className='header flex flex-1 flex-col p-1'>
            <div className='flex items-center justify-between'>
              <h2 className='text-neutral-700 dark:text-neutral-300'>{question.question}</h2>
              <span className='text-neutral-700 dark:text-neutral-300'>{t('points', { count: question.points })}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <div className='flex items-center gap-1 text-neutral-500 dark:text-neutral-400'>
                <Folder className='size-3' />
                <span className='lowercase'>{question.category}</span>
              </div>
              <span data-question-type={question.type} className='text-neutral-500 lowercase dark:text-neutral-400'>
                {tQuestion(`type.${question.type}`)}
              </span>
            </div>
          </div>
          <CreateQuestionDialog initialValues={question}>
            <div className='group dark:hover:ring-ring-hover hover:ring-ring-hover my-auto flex items-center gap-4 rounded-lg bg-neutral-300/50 p-1.5 ring-1 ring-neutral-400 hover:cursor-pointer hover:ring-[1.5px] dark:bg-neutral-700 dark:ring-neutral-600'>
              <Pen className='size-4 text-orange-600/70 group-hover:stroke-3 dark:text-orange-400/70' />
            </div>
          </CreateQuestionDialog>
          <button
            aria-label='Delete Question'
            type='button'
            onClick={() => removeQuestion(question.id)}
            className='group dark:hover:ring-ring-hover hover:ring-ring-hover my-auto flex items-center gap-4 rounded-lg bg-neutral-300/50 p-1.5 ring-1 ring-neutral-400 hover:cursor-pointer hover:ring-[1.5px] dark:bg-neutral-700 dark:ring-neutral-600'>
            <Trash2 className='size-4 text-red-600/70 group-hover:stroke-[2.5] dark:text-red-400/70' />
          </button>
        </Card>
      ))}
    </div>
  )
}
