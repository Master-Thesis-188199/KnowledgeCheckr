import React from 'react'
import { cn } from '@/src/lib/Shared/utils'
import { Question } from '@/src/schemas/QuestionSchema'

export default function QuestionNavigationMenu({
  questions,
  currentQuestionIndex,
  onQuestionClick,
  className,
  children,
}: {
  questions: Question[]
  currentQuestionIndex: number
  onQuestionClick: (index: number) => void
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn('ring-ring-subtle flex h-fit min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-[1.5px] dark:ring-neutral-600', className)}>
      <span className='font-semibold text-neutral-700 dark:text-neutral-300'>Questions</span>
      <nav className='grid grid-cols-[repeat(auto-fill,30px)] gap-2' id='exam-question-navigation'>
        {questions.map((_, i) => (
          <button
            className={cn(
              'ring-ring dark:ring-ring',
              'hover:ring-ring-hover dark:hover:ring-ring-hover flex size-7 items-center justify-center rounded-lg p-1 text-sm ring-1 hover:cursor-pointer hover:bg-neutral-300/60 dark:hover:bg-neutral-600/80',
              i === currentQuestionIndex && 'bg-neutral-300 ring-neutral-600/60 hover:cursor-default dark:bg-neutral-600/60 dark:ring-neutral-300/60',
            )}
            onClick={() => onQuestionClick(i)}
            key={`question-nav-${i}`}>
            {i + 1}
          </button>
        ))}
      </nav>
      {children}
    </div>
  )
}
