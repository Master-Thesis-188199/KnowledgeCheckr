'use client'
import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

export function PracticeCategorySelection() {
  const { unfilteredQuestions: questions, updatePracticeQuestions } = usePracticeStore((store) => store)
  const categories = useMemo(() => Array.from(new Set(questions.map((q) => q.category))), [questions])
  const router = useRouter()
  const pathname = usePathname()

  const filterPracticeQuestions = (categoryName?: string) => () => {
    updatePracticeQuestions(categoryName ? questions.filter((q) => q.category === categoryName) : questions)
    router.push(pathname.replace('category', '') + `?category=${encodeURIComponent(categoryName ?? '_none_')}`)
  }

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
      <ul className='rounded-md ring-2 dark:text-neutral-300 dark:ring-neutral-600'>
        <li className={cn(optionClasses, 'dark:bg-neutral-700/40')} onClick={filterPracticeQuestions()}>
          Combine all category questions
        </li>
        {categories.map((category) => (
          <li className={optionClasses} key={category} onClick={filterPracticeQuestions(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  )
}
