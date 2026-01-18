'use client'

import { redirect, RedirectType } from 'next/navigation'
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
      <div className={cn('ring-ring-subtle flex h-fit min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-[1.5px] dark:ring-neutral-600', className)}>
        <span className='font-semibold text-neutral-700 dark:text-neutral-300'>Questions</span>
        <nav className='grid grid-cols-[repeat(auto-fill,30px)] gap-2' id='exam-question-navigation'>
          {knowledgeCheck.questions.map((_, i) => (
            <button
              className={cn(
                'ring-ring dark:ring-ring',
                'hover:ring-ring-hover dark:hover:ring-ring-hover flex size-7 items-center justify-center rounded-lg p-1 text-sm ring-1 hover:cursor-pointer hover:bg-neutral-300/60 dark:hover:bg-neutral-600/80',
                i === currentQuestionIndex && 'bg-neutral-300 ring-neutral-600/60 hover:cursor-default dark:bg-neutral-600/60 dark:ring-neutral-300/60',
              )}
              onClick={() => setCurrentQuestionIndex(i)}
              key={`question-nav-${i}`}>
              {i + 1}
            </button>
          ))}
        </nav>
        <span className='text-sm text-neutral-500 dark:text-neutral-400'>
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
                  redirect('/checks', RedirectType.replace)
                })
            }
            start={startedAt}
            duration={knowledgeCheck.settings.examTimeFrameSeconds}
          />{' '}
          left
        </span>
        <ExamFinishDialog triggerClassname='ml-auto text-sm hover:cursor-pointer hover:underline dark:text-neutral-200/60 text-neutral-700/80'>
          <span>Finish Check</span>
        </ExamFinishDialog>
      </div>
    </>
  )
}
