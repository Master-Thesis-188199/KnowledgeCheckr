'use client'

import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import RenderQuestionType from '@/src/components/checks/[share_token]/practice/RenderQuestionType'
import { Button } from '@/src/components/shadcn/button'
import { cn } from '@/src/lib/Shared/utils'
import { Question } from '@/src/schemas/QuestionSchema'
import { notFound } from 'next/navigation'
import TextareaAutosize from 'react-textarea-autosize'

export function RenderPracticeQuestion() {
  const { questions, currentQuestionIndex, navigateToQuestion } = usePracticeStore((store) => store)

  const nextRandomQuestion = () => navigateToQuestion((currentQuestionIndex + 1) % questions.length)

  const question = questions.at(currentQuestionIndex)

  if (!question) notFound()

  return (
    <form className='flex flex-col gap-4'>
      <div className='my-8 flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-4'>
          <div className='flex size-6 items-center justify-center rounded-full p-1.5 text-sm font-semibold ring-1 ring-neutral-200'>{currentQuestionIndex + 1}</div>
          <h2 className='text-2xl font-semibold'>What colors are part of france&apos;s flag?</h2>
        </div>
        <span className='text-neutral-300'>{getQuestionActionDescriptor(question.type)}</span>
      </div>

      <div className={cn('grid min-h-[35vh] min-w-[25vw] grid-cols-2 gap-8 rounded-md p-6 ring-1 ring-neutral-500', question?.type === 'open-question' && 'grid-cols-1')}>
        <RenderQuestionType
          question={question}
          multipleChoice={(q) =>
            q.answers.map((a, i) => (
              <label
                key={`${q.id}-answer-${i}`}
                className={cn(
                  'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
                  'hover:cursor-pointer hover:ring-neutral-500 dark:hover:ring-neutral-300/60',
                  'focus:ring-[1.2px] focus:ring-neutral-700 dark:focus:ring-neutral-300/80',
                  'flex items-center justify-center',
                  'resize-none select-none',
                  'has-checked:ring-[1.5px] dark:has-checked:bg-neutral-700/60 dark:has-checked:ring-neutral-300',
                )}
                htmlFor={`${q.id}-answer-${i}`}>
                {a.answer}
                <input className='hidden' id={`${q.id}-answer-${i}`} type='checkbox' name={`${q.id}-answer-${i}`} value={a.answer} />
              </label>
            ))
          }
          singleChoice={(q) =>
            q.answers.map((a, i) => (
              <label
                key={`${q.id}-answer-${i}`}
                className={cn(
                  'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
                  'hover:cursor-pointer hover:ring-neutral-500 dark:hover:ring-neutral-300/60',
                  'focus:ring-[1.2px] focus:ring-neutral-700 dark:focus:ring-neutral-300/80',
                  'flex items-center justify-center',
                  'resize-none select-none',
                  'has-checked:ring-[1.5px] dark:has-checked:bg-neutral-700/60 dark:has-checked:ring-neutral-300',
                )}
                htmlFor={`${q.id}-answer-${i}`}>
                {a.answer}
                <input className='hidden' id={`${q.id}-answer-${i}`} type='radio' name={`${q.id}-answer`} value={a.answer} />
              </label>
            ))
          }
          dragDrop={(q) =>
            q.answers.map((a, i) => (
              <label
                key={`${q.id}-answer-${i}`}
                className={cn(
                  'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
                  'hover:cursor-pointer hover:ring-neutral-500 dark:hover:ring-neutral-300/60',
                  'focus:ring-[1.2px] focus:ring-neutral-700 dark:focus:ring-neutral-300/80',
                  'flex items-center justify-center',
                  'resize-none select-none',
                  'has-checked:ring-[1.5px] dark:has-checked:bg-neutral-700/60 dark:has-checked:ring-neutral-300',
                )}
                htmlFor={`${q.id}-answer-${i}`}>
                {a.answer}
                <input className='hidden' id={`${q.id}-answer-${i}`} type='number' name={`${q.id}-answer`} value={a.answer} readOnly />
              </label>
            ))
          }
          openQuestion={(q) => (
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
        />
      </div>

      <div className='flex justify-center'>
        <Button className='mx-auto mt-2' variant='secondary' onClick={nextRandomQuestion} type='button'>
          Check Answer
        </Button>
      </div>
    </form>
  )
}

function getQuestionActionDescriptor(question_type: Question['type']) {
  switch (question_type) {
    case 'single-choice':
      return 'Pick one answer-option from these options'
    case 'multiple-choice':
      return 'Pick one or more answers from these options'
    case 'drag-drop':
      return 'Arrange these options in the correct order'
    case 'open-question':
      return 'Write your answer into the designated field'
  }
}
