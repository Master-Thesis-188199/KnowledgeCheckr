'use client'

import { SquareIcon } from 'lucide-react'
import QuestionNavigationMenu from '@/src/components/checks/[share_token]/(shared)/QuestionNavigation'
import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import { StopwatchTime } from '@/src/components/Shared/StopwatchTime'

export function PracticeQuestionNavigation() {
  const { practiceQuestions, navigateToQuestion, currentQuestionIndex, startedAt } = usePracticeStore((store) => store)

  return (
    <>
      <QuestionNavigationMenu questions={practiceQuestions} currentQuestionIndex={currentQuestionIndex} onQuestionClick={navigateToQuestion}>
        <div className='flex gap-1 text-xs text-neutral-500 dark:text-neutral-400'>
          <span>Session </span>
          <span className=''>
            <StopwatchTime start={startedAt} delimiter=', ' />
          </span>
        </div>

        <div className='-mb-2 flex justify-end border-t pt-1'>
          <Button variant='ghost' type='button' size='sm' rippleClassname='bg-destructive/60' className='text-muted-foreground ring-ring-subtle/80 dark:ring-ring-subtle/80'>
            <SquareIcon className='text-destructive/70' />
            End Practice
          </Button>
        </div>
      </QuestionNavigationMenu>
    </>
  )
}
