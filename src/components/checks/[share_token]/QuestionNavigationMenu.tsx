'use client'

import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'
import ExamFinishDialog from '@/src/components/checks/[share_token]/ExamFinishDialog'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { TimeTicker } from '@/src/components/Shared/TimeTicker'
import finishExaminationAttempt from '@/src/lib/checks/[share_token]/FinishExaminationAttempt'
import { cn } from '@/src/lib/Shared/utils'
import { validateExaminationSchema } from '@/src/schemas/ExaminationSchema'

export function QuestionNavigationMenu({ className }: { className?: string }) {
  const { knowledgeCheck, setCurrentQuestionIndex, currentQuestionIndex, startedAt, ...examinationState } = useExaminationStore((store) => store)
  const { clearNavigationAbort } = useNavigationAbort()

  return (
    <>
      <div className={cn('flex h-fit min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-2 dark:ring-neutral-600', className)}>
        <span className='font-semibold dark:text-neutral-300'>Questions</span>
        <nav className='grid grid-cols-[repeat(auto-fill,30px)] gap-1.5' id='exam-question-navigation'>
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
        </nav>
        <span className='text-neutral-400'>
          <TimeTicker
            onTimeUp={() =>
              finishExaminationAttempt(validateExaminationSchema({ knowledgeCheck, startedAt, ...examinationState }))
                .catch((e) => {
                  toast(`Failed to submit examination results. ${e}`, { type: 'error' })
                })
                .then(() => {
                  toast('Successfully submitted examination results', { type: 'success' })
                  sessionStorage.removeItem('examination-store')
                  clearNavigationAbort()
                  redirect('/checks')
                })
            }
            start={startedAt}
            duration={knowledgeCheck.settings.examTimeFrameSeconds}
          />
        </span>
        <ExamFinishDialog triggerClassname='ml-auto text-sm hover:cursor-pointer hover:underline dark:text-neutral-200/60'>
          <span>Finish Check</span>
        </ExamFinishDialog>
      </div>
    </>
  )
}
