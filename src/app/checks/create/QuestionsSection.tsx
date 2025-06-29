'use client'

import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import { cn } from '@/lib/Shared/utils'
import CreateQuestionDialog from '@/src/components/check/create/(create-question)/CreateQuestionDialog'
import { Button } from '@/src/components/shadcn/button'
import { Folder, Info, Pen, Plus, Trash2 } from 'lucide-react'
export default function QuestionsSection() {
  const { questions, removeQuestion } = useCreateCheckStore((state) => state)

  return (
    <Card disableHoverStyles className='question-section break-inside-avoid'>
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
                    <h2 className='text-neutral-700 dark:text-neutral-300'>{question.question}</h2>
                    <span className='text-neutral-700 dark:text-neutral-300'>
                      {question.points} point{question.points > 1 && 's'}
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <div className='flex items-center gap-1 text-neutral-500 dark:text-neutral-400'>
                      <Folder className='size-3' />
                      <span className='lowercase'>{question.category}</span>
                    </div>
                    <span className='text-neutral-500 dark:text-neutral-400'>{question.type}</span>
                  </div>
                </div>
                <CreateQuestionDialog initialValues={question}>
                  <div className='group my-auto flex items-center gap-4 rounded-lg bg-neutral-300/50 p-1.5 ring-1 ring-neutral-400 hover:cursor-pointer hover:ring-[1.5px] dark:bg-neutral-700 dark:ring-neutral-600 dark:hover:ring-neutral-500/70'>
                    <Pen className='size-4 text-orange-600/70 group-hover:stroke-3 dark:text-orange-400/70' />
                  </div>
                </CreateQuestionDialog>
                <button
                  aria-label='Delete Question'
                  type='button'
                  onClick={() => removeQuestion(question.id)}
                  className='group my-auto flex items-center gap-4 rounded-lg bg-neutral-300/50 p-1.5 ring-1 ring-neutral-400 hover:cursor-pointer hover:ring-[1.5px] dark:bg-neutral-700 dark:ring-neutral-600 dark:hover:ring-neutral-500/70'>
                  <Trash2 className='size-4 text-red-600/70 group-hover:stroke-3 dark:text-red-400/70' />
                </button>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center gap-8'>
        <CreateQuestionDialog>
          <Button variant='outline' size='lg'>
            <Plus className='size-5' />
            Create Question
          </Button>
        </CreateQuestionDialog>
      </div>
    </Card>
  )
}
