'use client'

import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'

export function PracticeQuestionNavigation() {
  const { practiceQuestions, navigateToQuestion, currentQuestionIndex } = usePracticeStore((store) => store)

  return (
    <div id='practice-question-steps' className='mx-4 mb-8 grid grid-cols-[repeat(auto-fill,minmax(64,1fr))] gap-x-5 gap-y-10 lg:gap-x-12'>
      {practiceQuestions.map((q, i) => (
        <button type='button' disabled={currentQuestionIndex === i} key={q.id} className='group relative w-fit hover:cursor-pointer' onClick={() => navigateToQuestion(i)}>
          <span className='absolute right-0 bottom-2 left-0 text-center text-sm text-neutral-300 group-hover:font-semibold'>{i + 1}</span>
          <div className='h-2 w-16 rounded-xl bg-neutral-400 group-hover:bg-neutral-500 dark:group-active:bg-neutral-500/60' children='' />
        </button>
      ))}
    </div>
  )
}
