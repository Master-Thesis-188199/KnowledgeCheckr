'use client'

import { SquareIcon } from 'lucide-react'
import { redirect, RedirectType } from 'next/navigation'
import QuestionNavigationMenu from '@/src/components/checks/[share_token]/(shared)/QuestionNavigation'
import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import ConfirmationDialog from '@/src/components/Shared/ConfirmationDialog/ConfirmationDialog'
import { StopwatchTime } from '@/src/components/Shared/StopwatchTime'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { computeQuestionInputScore } from '@/src/lib/checks/computeQuestionScore'

export function PracticeQuestionNavigation() {
  const { practiceQuestions, navigateToQuestion, currentQuestionIndex, startedAt, results } = usePracticeStore((store) => store)
  const t = useScopedI18n('Practice.PracticeQuestionNavigation')

  return (
    <>
      <QuestionNavigationMenu
        questionStatus={(q) => {
          const userInput = results.find((r) => r.question_id === q.id)
          if (!userInput) return 'unanswered'

          const score = computeQuestionInputScore(q, userInput)
          if (score === null) return 'unanswered'

          if (score === 0) return 'incorrect'
          if (score >= q.points * 0.9) return 'correct'

          return 'partly-correct'
        }}
        questions={practiceQuestions}
        currentQuestionIndex={currentQuestionIndex}
        onQuestionClick={navigateToQuestion}>
        <div className='flex gap-1 text-xs text-neutral-500 dark:text-neutral-400'>
          <span>{t('session_timer_label')}</span>
          <span className=''>
            <StopwatchTime start={startedAt} delimiter=', ' />
          </span>
        </div>

        <div className='-mb-2 flex justify-end border-t pt-1'>
          <ConfirmationDialog
            confirmLabel={t('EndPractice_ConfirmDialog.confirm_button_label')}
            cancelLabel={t('EndPractice_ConfirmDialog.cancel_button_label')}
            title={t('EndPractice_ConfirmDialog.title')}
            body={t('EndPractice_ConfirmDialog.body')}
            confirmAction={() => {
              //! For testing purposes users can navigate back to the practice-page when the app is not in production.
              redirect('/checks', process.env.NEXT_PUBLIC_MODE !== 'production' ? RedirectType.push : RedirectType.replace)
            }}>
            <Button variant='link' type='button' size='sm' rippleClassname='bg-destructive/60' className='text-muted-foreground ring-ring-subtle/80 dark:ring-ring-subtle/80'>
              <SquareIcon className='text-destructive/70' />
              {t('EndPractice_button_label')}
            </Button>
          </ConfirmationDialog>
        </div>
      </QuestionNavigationMenu>
    </>
  )
}
