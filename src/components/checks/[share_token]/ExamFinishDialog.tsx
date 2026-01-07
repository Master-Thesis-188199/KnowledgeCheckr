'use client'

import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import isEmpty from 'lodash/isEmpty'
import { CheckCheckIcon } from 'lucide-react'
import { redirect, RedirectType } from 'next/navigation'
import { toast } from 'react-toastify'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import finishExaminationAttempt from '@/src/lib/checks/[share_token]/FinishExaminationAttempt'
import { cn } from '@/src/lib/Shared/utils'
import { ExaminationSchema, validateExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { Question } from '@/src/schemas/QuestionSchema'

export default function ExamFinishDialog({ children, triggerClassname }: { children: React.ReactNode; triggerClassname?: string }) {
  const { knowledgeCheck, ...examinationState } = useExaminationStore((state) => state)
  const { clearNavigationAbort } = useNavigationAbort()

  return (
    <Dialog>
      <DialogTrigger asChild className={cn('', triggerClassname)}>
        {children}
      </DialogTrigger>
      <DialogContent className='bg-neutral-100 shadow-md shadow-neutral-50/30 dark:bg-neutral-900 dark:shadow-neutral-900/80'>
        <DialogHeader className='border-b border-b-neutral-400/80 pb-3 text-left dark:border-b-neutral-500/80'>
          <DialogTitle>Finish Examination Attempt?</DialogTitle>
          <DialogDescription className='tracking-tight text-neutral-500 dark:text-neutral-400'>Do you want to submit your examination reults?</DialogDescription>
        </DialogHeader>
        <div className='mt-2 flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <span className='text-neutral-700 dark:text-neutral-200'>Question Overview</span>
            <div className='flex flex-wrap gap-4 px-4'>
              {knowledgeCheck.questions.map((q, i) => (
                <div
                  className={cn(
                    'dark:ring-ring ring-ring relative flex w-9 rounded-md py-1 text-center ring-1',
                    isQuestionAnswered(examinationState.results, q.id) && 'bg-green-700/20 dark:bg-green-800/60',
                  )}
                  key={i}>
                  <div
                    className={cn('absolute -top-2 -right-2 hidden items-center justify-center rounded-tr-md rounded-bl-md p-[2.5px]', isQuestionAnswered(examinationState.results, q.id) && 'flex')}>
                    <CheckCheckIcon className={cn('size-4 text-green-700 dark:text-green-400/80')} />
                  </div>
                  <span className={cn('mx-auto')}>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-between'>
            <DialogClose asChild>
              <Button variant='outline' className='dark:ring-ring-subtle ring-ring rounded-md px-4 py-1.5 ring-1'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() =>
                finishExaminationAttempt(validateExaminationSchema({ knowledgeCheck, ...examinationState }))
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
              className='dark:ring-ring-subtle ring-ring-subtle rounded-md bg-neutral-500 px-4 py-1.5 ring-[1.5px] dark:bg-black'>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function isQuestionAnswered(results: ExaminationSchema['results'], id: Question['id']) {
  return !isEmpty(results.find((r) => r.question_id === id)?.answer ?? {})
}
