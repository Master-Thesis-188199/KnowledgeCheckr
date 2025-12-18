'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'

export function PracticeCategorySelection({ questions, share_token }: { questions: Question[]; share_token: KnowledgeCheck['share_key'] }) {
  const categories = useMemo(() => Array.from(new Set(questions.map((q) => q.category))), [questions])

  const optionClasses = cn(
    'cursor-pointer px-3 py-1.5 hover:ring-1 hover:rounded-md dark:ring-neutral-400/70 dark:hover:bg-neutral-800 ',
    'dark:active:bg-neutral-700',
    'last:border-b-0 border-b border-neutral-600 first:border-b-3 first:hover:border-b-transparent',
  )

  return (
    <div className='mx-auto flex flex-col gap-6 md:my-auto md:pb-32'>
      <div>
        <h2 className='text-lg font-semibold'>Select practice category</h2>
        <p className='text-neutral-400'>Choose the question-category you want to practice with.</p>
      </div>
      <ul className='flex flex-col rounded-md ring-2 select-none dark:text-neutral-300 dark:ring-neutral-600' id='category-selection'>
        <Link
          data-category='all'
          className={cn(optionClasses, 'dark:bg-neutral-700/40')}
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
    </div>
  )
}
