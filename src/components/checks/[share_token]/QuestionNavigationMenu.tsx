'use client'

import ExamFinishDialog from '@/src/components/checks/[share_token]/ExamFinishDialog'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

export function QuestionNavigationMenu({ className }: { className?: string }) {
  const { knowledgeCheck, setCurrentQuestionIndex, currentQuestionIndex } = useExaminationStore((store) => store)

  return (
    <>
      <div className={cn('flex max-h-fit min-h-24 min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-2 dark:ring-neutral-600', className)}>
        <span className='font-semibold dark:text-neutral-300'>Questions</span>
        <div className='grid grid-cols-[repeat(auto-fill,30px)] gap-1.5'>
          {knowledgeCheck.questions.map((_, i) => (
            <button
              className={cn(
                'flex size-7 items-center justify-center rounded-lg p-1 text-sm ring-1 hover:cursor-pointer hover:ring-neutral-300/60 dark:ring-neutral-500 dark:hover:bg-neutral-600',
                i === currentQuestionIndex && 'hover:cursor-default dark:bg-neutral-600 dark:ring-neutral-300/60',
              )}
              onClick={() => setCurrentQuestionIndex(i)}
              key={`question-nav-${i}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <ExamFinishDialog triggerClassname='ml-auto text-sm hover:cursor-pointer hover:underline dark:text-neutral-200/60'>
          <span>Finish Check</span>
        </ExamFinishDialog>
      </div>
    </>
  )
}
