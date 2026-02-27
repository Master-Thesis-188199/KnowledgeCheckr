'use client'

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
    <div className={cn('flex h-fit min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-[1.5px] ring-ring-subtle dark:ring-neutral-600', className)}>
      <span className='font-semibold text-neutral-700 dark:text-neutral-300'>Questions</span>
      <nav className='grid grid-cols-[repeat(auto-fill,30px)] gap-2' id='exam-question-navigation'>
        {questions.map((_, i) => (
          <button
            data-selected={i === currentQuestionIndex || undefined}
            className={cn(
              'ring-ring dark:ring-ring',
              'flex size-7 items-center justify-center rounded-lg p-1 text-sm ring-1 hover:cursor-pointer hover:bg-neutral-300/60 hover:ring-ring-hover data-selected:hover:cursor-default dark:hover:bg-neutral-600/80 dark:hover:ring-ring-hover',
              'data-selected:bg-neutral-300 data-selected:ring-neutral-600/60 dark:data-selected:bg-neutral-600/60 dark:data-selected:ring-neutral-300/40',
              'data-selected:ring-[1.7px]',
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
