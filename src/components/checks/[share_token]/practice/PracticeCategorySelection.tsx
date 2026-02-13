'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import Card from '@/src/components/Shared/Card'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'

export function PracticeCategorySelection({ questions, share_token }: { questions: Question[]; share_token: KnowledgeCheck['share_key'] }) {
  const categories = useMemo(() => Array.from(new Set(questions.map((q) => q.category))), [questions])

  const optionClasses = cn(
    'cursor-pointer px-3 py-1.5 hover:ring-1 hover:rounded-md hover:bg-neutral-200/90 dark:ring-neutral-400/70 dark:hover:bg-neutral-800',
    'dark:active:bg-neutral-700 active:bg-neutral-300/80',
    'hover:ring-ring-hover dark:hover:ring-ring-hover',
    'last:border-b-0 border-b border-ring-subtle dark:border-neutral-600 first:border-b-3 first:hover:border-b-transparent',
  )

  return (
    <Card className='mx-auto flex flex-col gap-6 p-6 md:my-auto md:mt-32' disableInteractions>
      <div>
        <h2 className='text-lg font-semibold'>Select practice category</h2>
        <p className='text-neutral-500 dark:text-neutral-400'>Choose the question-category you want to practice with.</p>
      </div>
      <ul className='dark:ring-ring-subtle ring-ring-subtle flex flex-col rounded-md text-neutral-700 ring-2 select-none dark:text-neutral-300' id='category-selection'>
        <Link
          data-category='all'
          className={cn(optionClasses, 'rounded-t-md bg-neutral-200 hover:bg-neutral-300/80 dark:bg-neutral-700/50 dark:hover:bg-neutral-700')}
          href={{
            pathname: `/checks/${share_token}/practice`,
            query: { category: '_none_' },
          }}>
          Combine all category questions
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            data-category={category}
            className={optionClasses}
            href={{
              pathname: `/checks/${share_token}/practice`,
              query: { category },
            }}>
            {category}
          </Link>
        ))}
      </ul>
    </Card>
  )
}
