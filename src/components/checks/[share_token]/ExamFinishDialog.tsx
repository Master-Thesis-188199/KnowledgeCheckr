'use client'

import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import finishExaminationAttempt from '@/src/lib/checks/[share_token]/FinishExaminationAttempt'
import { cn } from '@/src/lib/Shared/utils'
import { DialogDescription } from '@radix-ui/react-dialog'
import { redirect } from 'next/navigation'
import { toast } from 'react-toastify'

export default function ExamFinishDialog({ children, triggerClassname }: { children: React.ReactNode; triggerClassname?: string }) {
  const { knowledgeCheck } = useExaminationStore((state) => state)
  const { clearNavigationAbort } = useNavigationAbort()

  return (
    <Dialog>
      <DialogTrigger className={cn('', triggerClassname)}>{children}</DialogTrigger>
      <DialogContent className='shadow-md dark:bg-neutral-900 dark:shadow-neutral-900/80'>
        <DialogHeader className='border-b border-b-neutral-400/80 pb-3 text-left dark:border-b-neutral-500/80'>
          <DialogTitle>Finish Examination Attempt?</DialogTitle>
          <DialogDescription className='tracking-tight dark:text-neutral-400'>Do you want to submit your examination reults?</DialogDescription>
        </DialogHeader>
        <div className='mt-2 flex flex-col gap-8'>
          <div className='flex flex-col gap-4'>
            <span className='dark:text-neutral-200'>Question Overview</span>
            <div className='flex flex-wrap gap-4 px-4'>
              {Array.from({ length: 15 }).map((_, i) => (
                <div className='w-9 rounded-md py-1 text-center ring-1 dark:bg-green-900/60 dark:ring-neutral-700' key={i}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className='flex justify-between'>
            <Button variant='outline' className='rounded-md px-4 py-1.5 ring-1 dark:ring-neutral-600'>
              Cancel
            </Button>
            <Button
              onClick={() =>
                finishExaminationAttempt(knowledgeCheck)
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
              className='rounded-md px-4 py-1.5 ring-[1.5px] dark:bg-black dark:ring-neutral-600'>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
