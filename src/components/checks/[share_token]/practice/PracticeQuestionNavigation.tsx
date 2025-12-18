'use client'

import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

export function PracticeQuestionNavigation() {
  const { practiceQuestions, navigateToQuestion, currentQuestionIndex } = usePracticeStore((store) => store)

  return (
    <div id='practice-question-steps' className='mx-4 mb-8 grid grid-cols-[repeat(auto-fill,minmax(64,1fr))] gap-x-5 gap-y-10 lg:gap-x-12'>
      {practiceQuestions.map((q, i) => (
        <button
          aria-label={`select question ${i}`}
          type='button'
          data-selected={currentQuestionIndex === i}
          disabled={currentQuestionIndex === i}
          key={q.id}
          className={cn('group relative w-fit enabled:hover:cursor-pointer disabled:hover:cursor-auto')}
          onClick={() => navigateToQuestion(i)}>
          <span className='absolute right-0 bottom-2 left-0 text-center text-sm text-neutral-300 group-enabled:group-hover:font-semibold'>{i + 1}</span>
          <div className='h-2 w-16 rounded-xl bg-neutral-600 group-enabled:group-hover:bg-neutral-500 group-data-[selected="true"]:bg-neutral-400 dark:group-active:bg-neutral-500/60' children='' />
        </button>
      ))}
    </div>
  )
}
