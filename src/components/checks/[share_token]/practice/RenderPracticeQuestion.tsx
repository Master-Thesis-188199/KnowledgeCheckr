'use client'

import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import { cn } from '@/src/lib/Shared/utils'
import TextareaAutosize from 'react-textarea-autosize'

export function RenderPracticeQuestion() {
  const { questions, currentQuestionIndex, navigateToQuestion } = usePracticeStore((store) => store)

  const nextRandomQuestion = () => navigateToQuestion((currentQuestionIndex + 1) % questions.length)

  const question = questions.at(currentQuestionIndex)

  const question_action_descriptor =
    question?.type === 'multiple-choice'
      ? 'Pick one or more answers from these options'
      : question?.type === 'single-choice'
        ? 'Pick one answer-option from these options'
        : question?.type === 'drag-drop'
          ? 'Arrange these options in the correct order'
          : 'Write your answer into the designated field'

  return (
    <div className='flex flex-col gap-4'>
      <div className='my-8 flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-4'>
          <div className='flex size-6 items-center justify-center rounded-full p-1.5 text-sm font-semibold ring-1 ring-neutral-200'>{currentQuestionIndex + 1}</div>
          <h2 className='text-2xl font-semibold'>What colors are part of france&apos;s flag?</h2>
        </div>
        <span className='text-neutral-300'>{question_action_descriptor}</span>
      </div>

      <div className={cn('grid min-h-[35vh] min-w-[25vw] grid-cols-2 gap-8 rounded-md p-6 ring-1 ring-neutral-500', question?.type === 'open-question' && 'grid-cols-1')}>
        {(question?.type === 'single-choice' || question?.type === 'multiple-choice' || question?.type === 'drag-drop') && (
          <>
            {question.answers.map((a) => (
              <div className='flex cursor-pointer items-center justify-center rounded-md bg-neutral-600/70 ring-neutral-500 hover:bg-neutral-600 hover:ring-1' key={a.answer}>
                {a.answer}
              </div>
            ))}
          </>
        )}

        {question?.type === 'open-question' && (
          <TextareaAutosize
            maxRows={11}
            minRows={11}
            className={cn(
              'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
              'resize-none',
              'my-auto',
            )}
          />
        )}
      </div>

      <div className='flex justify-center'>
        <Button className='mx-auto mt-2' variant='secondary' onClick={nextRandomQuestion}>
          Check Answer
        </Button>
      </div>
    </div>
  )
}
