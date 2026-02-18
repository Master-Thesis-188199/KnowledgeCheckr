'use client'

import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Progress } from '@/src/components/shadcn/progress'

/**
 * Renders a progress bar indicating the (learning / answering) progress the user has made while practicing.
 */
export function PracticeProgress() {
  const { practiceQuestions: questions, results } = usePracticeStore((store) => store)

  return (
    <div className='relative mx-5 my-0'>
      <Progress value={(results.length / questions.length) * 100} className='h-5' indicatorClasses='dark:bg-green-700 bg-green-500' />

      <div className='absolute -top-1 right-1 -bottom-1 left-1 m-0 flex items-center justify-center p-0 text-sm'>
        {results.length} / {questions.length} answered
      </div>
    </div>
  )
}
