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
  questionStatus,
}: {
  questions: Question[]
  currentQuestionIndex: number
  onQuestionClick: (index: number) => void
  className?: string
  children?: React.ReactNode
  questionStatus?: (question: Question, index: number) => 'correct' | 'incorrect' | 'partly-correct' | 'unanswered'
}) {
  return (
    <div className={cn('flex h-fit min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-[1.5px] ring-ring-subtle dark:ring-neutral-600', className)}>
      <span className='font-semibold text-neutral-700 dark:text-neutral-300'>Questions</span>
      <nav className='grid grid-cols-[repeat(auto-fill,30px)] gap-2' id='exam-question-navigation'>
        {questions.map((_, i) => (
          <button
            data-selected={i === currentQuestionIndex || undefined}
            data-status-correct={questionStatus?.(_, i) === 'correct' || undefined}
            data-status-incorrect={questionStatus?.(_, i) === 'incorrect' || undefined}
            data-status-partly-correct={questionStatus?.(_, i) === 'partly-correct' || undefined}
            data-status-unanswered={questionStatus?.(_, i) === 'unanswered' || undefined}
            className={cn(
              'ring-ring dark:ring-ring',
              'flex size-7 items-center justify-center rounded-lg p-1 text-sm ring-1 hover:cursor-pointer hover:bg-neutral-300/60 hover:ring-ring-hover data-selected:hover:cursor-default dark:hover:bg-neutral-600/80 dark:hover:ring-ring-hover',
              'data-selected:data-status-unanswered:bg-neutral-300 data-selected:data-status-unanswered:ring-neutral-600/60 dark:data-selected:data-status-unanswered:bg-neutral-600/60 dark:data-selected:data-status-unanswered:ring-neutral-300/40',

              'data-status-correct:bg-linear-to-bl data-status-correct:from-neutral-100 data-status-correct:to-success-300/20 data-status-correct:to-60% data-status-correct:ring-success-400/40 dark:data-status-correct:from-neutral-700 dark:data-status-correct:to-success/40 dark:data-status-correct:to-50% dark:data-status-correct:ring-success/60',

              'data-status-incorrect:bg-linear-to-bl data-status-incorrect:from-neutral-100 data-status-incorrect:to-destructive-300/20 data-status-incorrect:to-60% data-status-incorrect:ring-destructive-400/40 dark:data-status-incorrect:from-neutral-700 dark:data-status-incorrect:to-destructive/40 dark:data-status-incorrect:to-50% dark:data-status-incorrect:ring-destructive/60',

              'data-status-partly-correct:bg-linear-to-bl data-status-partly-correct:from-neutral-100 data-status-partly-correct:to-warning-200/20 data-status-partly-correct:to-60% data-status-partly-correct:ring-warning-400/40 dark:data-status-partly-correct:from-neutral-700 dark:data-status-partly-correct:to-warning/40 dark:data-status-partly-correct:to-50% dark:data-status-partly-correct:ring-warning/60',

              'not-data-status-unanswered:hover:bg-current/10 not-data-status-unanswered:hover:ring-2 dark:hover:bg-current/10',
              'not-data-status-unanswered:data-selected:ring-2 data-status-unanswered:data-selected:ring-[1.7px]',
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
