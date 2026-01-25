'use client'

import { Folder, Info, Pen, Plus, Trash2 } from 'lucide-react'
import { TbPoint } from 'react-icons/tb'
import { useCheckStore } from '@/components/checks/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import { cn } from '@/lib/Shared/utils'
import CreateQuestionDialog from '@/src/components/checks/create/(create-question)/CreateQuestionDialog'
import { Button } from '@/src/components/shadcn/button'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { ChoiceQuestion, DragDropQuestion, Question } from '@/src/schemas/QuestionSchema'
export default function QuestionsSection() {
  const { questions } = useCheckStore((state) => state)
  const t = useScopedI18n('Checks.buttons')

  return (
    <div className='question-section flex flex-col gap-8'>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-10'>
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
      <EmptyQuestionsStatus show={questions.length === 0} />

      <div className='flex justify-center gap-8'>
        <CreateQuestionDialog>
          <Button variant='outline' size='lg'>
            <Plus className='size-5' />
            {t('create_question')}
          </Button>
        </CreateQuestionDialog>
      </div>
    </div>
  )
}

function EmptyQuestionsStatus({ show }: { show: boolean }) {
  const t = useScopedI18n('Checks')
  return (
    <div className={cn('flex h-60 flex-col items-center justify-center gap-6', !show && 'hidden')}>
      <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
      <span className='text-center tracking-wide text-balance text-neutral-500 dark:text-neutral-400'>{t('no_existing_questions')}</span>
    </div>
  )
}

function QuestionCard({ question }: { question: Question }) {
  const { removeQuestion, questions } = useCheckStore((state) => state)
  const t = useScopedI18n('Checks.QuestionCard')

  return (
    <Card className='question flex flex-col gap-10' data-question-id={question.id} data-question={question.question} disableInteractions>
      <div className='header -mb-4 flex items-center justify-between border-b pb-4 text-sm'>
        <div className='flex gap-1 text-neutral-500 dark:text-neutral-400'>
          <span>{t('question_label')}</span>
          <span className='text-neutral-600 dark:text-neutral-300'>
            {questions.findIndex((q) => q.id === question.id) + 1} / {questions.length}
          </span>
        </div>

        <span data-question-type={question.type} className='bg-highlight rounded-md px-2 py-1 text-neutral-600/80 capitalize dark:text-neutral-300/80'>
          {question.type.split('-').join(' ')}
        </span>
        <div className='flex items-center gap-4'>
          <span className='flex items-center gap-0.5 text-neutral-600/80 dark:text-neutral-300/80'>
            <TbPoint className='text-orange-600/80 dark:text-orange-400/60' /> {t('points_label', { count: question.points })}
          </span>
        </div>
      </div>
      <div className='mx-12 flex items-center justify-center gap-4'>
        <h1 data-question={question.question} className='px-2 py-1 text-center text-neutral-700/90 dark:text-neutral-200/90'>
          {question.question}
        </h1>
      </div>

      <Seperator className='-mt-4 -mb-3' label='&zwnj;' />

      {question.type !== 'open-question' ? (
        <div className='flex flex-1 items-center'>
          <div className={cn('mx-4 grid w-[stretch] grid-cols-[150px_150px] justify-evenly gap-10 text-sm', question.answers.length > 4 && 'gap-4')}>
            {question.answers.map((answer) => {
              const isChoiceQuestion = (answer as ChoiceQuestion['answers'][number]).correct === true || (answer as ChoiceQuestion['answers'][number]).correct === false
              const isCorrect = (answer as ChoiceQuestion['answers'][number]).correct ? true : false

              return (
                <div
                  className={cn(
                    'relative flex items-center justify-center gap-4 rounded-md bg-neutral-300/30 px-3 py-1.5 dark:bg-neutral-700/40',
                    'text-neutral-600/80 dark:text-neutral-300/80',
                    isChoiceQuestion && 'ring-2',
                    isChoiceQuestion && isCorrect && 'ring-green-600/20 dark:ring-green-400/20',
                    isChoiceQuestion && !isCorrect && 'ring-red-700/20 dark:ring-red-400/25',
                  )}
                  key={answer.id}>
                  {question.type === 'drag-drop' && (
                    <span className='absolute top-0 bottom-0 left-3 flex items-center text-sm text-neutral-500/80 dark:text-neutral-300/70'>
                      {(answer as DragDropQuestion['answers'][number]).position + 1}
                    </span>
                  )}

                  <span className='truncate text-ellipsis' title={answer.answer}>
                    {answer.answer}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className='mx-12 flex flex-1 justify-center'>
          <p
            className='ring-input-ring/30 dark:ring-input-ring/50 h-[stretch] w-[stretch] resize-none rounded-md bg-neutral-300/15 px-3 py-2 text-neutral-600/70 ring-1 dark:bg-neutral-700/30 dark:text-neutral-300/70'
            children={question.expectation}
          />
        </div>
      )}

      {/* <StatisticElement capitalizeValue label='Accessibility' value={question.accessibility} />
        {question.type !== 'open-question' && <StatisticElement label='Answers' value={question.answers.length} />}
        <StatisticElement capitalizeValue label='Category' value={question.category} /> */}
      <div className='flex justify-center gap-4'>
        <CreateQuestionDialog initialValues={question}>
          <Button variant='outline' type='button' className='group'>
            Edit
            <Pen className='size-4 text-orange-600/70 group-hover:stroke-3 dark:text-orange-300/70' />
          </Button>
        </CreateQuestionDialog>
        <Button variant='destructive' aria-label='Delete Question' type='button' onClick={() => removeQuestion(question.id)} className='group'>
          Remove
          <Trash2 className='size-4 group-hover:stroke-[2.5]' />
        </Button>
      </div>
    </Card>
  )
}

function RenderCreatedQuestions({ show }: { show: boolean }) {
  const { questions, removeQuestion } = useCheckStore((state) => state)

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
            {question.accessibility.split('-').at(0)} Question
          </div>
          <div className='header flex flex-1 flex-col p-1'>
            <div className='flex items-center justify-between'>
              <h2 className='text-neutral-700 dark:text-neutral-300'>{question.question}</h2>
              <span className='text-neutral-700 dark:text-neutral-300'>
                {question.points} point{question.points > 1 && 's'}
              </span>
            </div>
            <div className='flex justify-between text-xs'>
              <div className='flex items-center gap-1 text-neutral-500 dark:text-neutral-400'>
                <Folder className='size-3' />
                <span className='lowercase'>{question.category}</span>
              </div>
              <span className='text-neutral-500 dark:text-neutral-400'>{question.type}</span>
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

function StatisticElement({ label, value, capitalizeValue = false }: { label: string; value: React.ReactNode; capitalizeValue?: boolean }) {
  return (
    <div className='flex max-w-fit flex-col items-center gap-1'>
      <dt className='text-sm text-neutral-500 dark:text-neutral-400'>{label}</dt>
      <dd className={cn('order-first text-lg font-semibold tracking-tight text-neutral-600/90 dark:text-neutral-300', capitalizeValue && 'capitalize')}>{value}</dd>
    </div>
  )
}

function Seperator({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn(className, 'relative')}>
      <div className='absolute inset-0 inset-x-12 flex items-center' aria-hidden='true'>
        <div className='h-[1px] w-full bg-gradient-to-r from-neutral-400/50 via-neutral-500 to-neutral-400/50 dark:from-neutral-700 dark:via-neutral-500 dark:to-neutral-700' />

        {label && (
          <p className='absolute right-0 left-0 mx-auto flex w-fit justify-center gap-2 bg-[#EBECED] px-3 text-sm leading-6 tracking-widest text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'>
            <span className=''>{label}</span>
          </p>
        )}
      </div>
    </div>
  )
}
