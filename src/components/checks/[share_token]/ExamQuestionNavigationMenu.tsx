'use client'

import { redirect, RedirectType } from 'next/navigation'
import { toast } from 'react-toastify'
import QuestionNavigationMenu from '@/src/components/checks/[share_token]/(shared)/QuestionNavigation'
import ExamFinishDialog from '@/src/components/checks/[share_token]/ExamFinishDialog'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { CountdownTime } from '@/src/components/Shared/CountdownTime'
import { useLogger } from '@/src/hooks/log/useLogger'
import finishExaminationAttempt from '@/src/lib/checks/[share_token]/FinishExaminationAttempt'
import { validateExaminationSchema } from '@/src/schemas/ExaminationSchema'

export function ExamQuestionNavigationMenu({ className }: { className?: string }) {
  const { error } = useLogger('ExamQuestionNavigationMenu')
  const { knowledgeCheck, setCurrentQuestionIndex, currentQuestionIndex, startedAt, ...examinationState } = useExaminationStore((store) => store)
  const { clearNavigationAbort } = useNavigationAbort()

  return (
    <>
      <QuestionNavigationMenu className={className} currentQuestionIndex={currentQuestionIndex} questions={knowledgeCheck.questions} onQuestionClick={(index) => setCurrentQuestionIndex(index)}>
        <span className='text-sm text-neutral-500 dark:text-neutral-400'>
          <CountdownTime
            onTimeUp={() =>
              finishExaminationAttempt(validateExaminationSchema({ knowledgeCheck, startedAt, ...examinationState }))
                .catch((e) => {
                  toast(`Failed to submit examination results. ${e}`, { type: 'error' })
                  error('Failed to finish examination attempt', e)
                })
                .then(() => {
                  toast('Successfully submitted examination results', { type: 'success' })
                  sessionStorage.removeItem('examination-store')
                  clearNavigationAbort()
                  redirect('/checks', RedirectType.replace)
                })
            }
            start={startedAt}
            duration={knowledgeCheck.settings.examination.examTimeFrameSeconds}
          />{' '}
          left
        </span>
        <ExamFinishDialog triggerClassname='ml-auto text-sm dark:text-neutral-200/60 text-neutral-700/80 -mb-2'>
          <Button variant='ghost' type='button'>
            Finish Check
          </Button>
        </ExamFinishDialog>
      </QuestionNavigationMenu>
    </>
  )
}
