'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { InfoIcon } from 'lucide-react'
import ExamFinishDialog from '@/src/components/checks/[share_token]/ExamFinishDialog'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import RenderExamQuestion from '@/src/components/checks/[share_token]/RenderExamQuestion'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { cn } from '@/src/lib/Shared/utils'

export function ExamQuestionWrapper() {
  const { enableNavigationAbort } = useNavigationAbort()
  const { currentQuestionIndex, knowledgeCheck, nextQuestion, previousQuestion, isLastQuestion } = useExaminationStore((store) => store)

  useEffect(() => {
    enableNavigationAbort({ title: 'Abort Examination Attempt?', description: 'By leaving now all your process will be lost and your attempt will be submitted.' })
  }, [])

  if (knowledgeCheck.questions?.length === 0)
    return (
      <div className='mx-auto flex max-h-fit w-full max-w-7xl items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300'>
        <InfoIcon className='size-5' />
        No questions available
      </div>
    )

  return (
    <motion.div
      key={currentQuestionIndex}
      animate={{
        scale: [1, 0.98, 1],
        opacity: [0.75, 1, 1],
        transition: { duration: 0.15, ease: 'easeInOut' },
      }}
      className='relative mx-auto max-h-fit w-full max-w-7xl'>
      <RenderExamQuestion />
      <div className='absolute right-0 -bottom-16 left-0 flex justify-between px-8'>
        <Button variant='outline' onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>
        <Button onClick={nextQuestion} disabled={isLastQuestion}>
          Next
        </Button>

        <FinishAttemptButton className='absolute right-1/3 -bottom-16 left-1/3' />
      </div>
    </motion.div>
  )
}

export function FinishAttemptButton({ className }: { className?: string }) {
  const { isLastQuestion } = useExaminationStore((store) => store)

  return (
    <ExamFinishDialog
      triggerClassname={cn(
        'ml-auto text-sm hover:cursor-pointer hover:underline dark:text-neutral-200/60',

        /* Button styles */
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer",
        'dark:!active:bg-primary/70 bg-neutral-500 text-white shadow-xs ring-neutral-500 hover:bg-neutral-500/80 hover:ring-[1.5px] active:scale-[101%] active:!bg-neutral-600/95 dark:bg-black dark:text-neutral-200 dark:ring-neutral-600 dark:hover:bg-neutral-900 dark:active:!bg-neutral-700',
        'h-9 px-4 py-2 has-[>svg]:px-3',
        /* End Button styles */

        isLastQuestion ? 'block' : 'hidden',
        className,
      )}>
      Finish Attempt
    </ExamFinishDialog>
  )
}
