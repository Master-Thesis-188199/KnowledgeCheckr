'use client'

import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import { cn } from '@/lib/Shared/utils'
import CreateQuestionDialog from '@/src/components/check/create/(create-question)/CreateQuestionDialog'
import { Info, Plus } from 'lucide-react'
import { useState } from 'react'
export default function QuestionsSection() {
  const { questions } = useCreateCheckStore((state) => state)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card disableHoverStyles className='break-inside-avoid'>
      <div className='header -m-3 mb-0 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>Questions</h2>
        </div>
      </div>
      <div className='questions'>
        <div className={cn('my-20 flex flex-col items-center justify-center gap-6', questions.length > 0 && 'hidden')}>
          <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
          <span className='tracking-wide text-neutral-500 dark:text-neutral-400'>Currently there are no questions associated to this quiz</span>
        </div>
        <div className={cn('my-4 grid grid-cols-1 gap-6')}>
          {questions.map((question, i) => (
            <div key={i + question.id}>
              <Card className='question flex gap-3 p-2 hover:bg-none'>
                <div className='header flex flex-1 flex-col p-1'>
                  <div className='flex items-center justify-between'>
                    <h2 className=''>{question.question}</h2>
                    <span className='dark:text-neutral-200'>
                      {question.points} point{question.points > 1 && 's'}
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <div className='flex items-center gap-1 text-neutral-400 dark:text-neutral-400'>
                      <span className='lowercase'>{question.category}</span>
                    </div>
                    <span className='text-neutral-400 dark:text-neutral-400'>{question.type}</span>
                  </div>
                </div>
                {/* <CreateQuestionDialog open={dialogOpen} setOpen={setDialogOpen}>
                  <div className='my-auto flex max-h-10 items-center gap-4 rounded-md p-3 hover:cursor-pointer dark:bg-neutral-600/70'>
                    <Pen className='size-4 dark:text-orange-400/70' />
                  </div>
                </CreateQuestionDialog> */}
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center gap-8'>
        <CreateQuestionDialog open={dialogOpen} setOpen={setDialogOpen}>
          <div className='mx-4 flex w-72 items-center justify-center gap-2 rounded-md border-2 border-dashed border-blue-500/70 p-3 tracking-wider hover:cursor-pointer dark:border-neutral-300/70 dark:text-neutral-300 dark:hover:bg-neutral-500/30'>
            <Plus className='size-5' />
            Create Question
          </div>
        </CreateQuestionDialog>
      </div>
    </Card>
  )
}
