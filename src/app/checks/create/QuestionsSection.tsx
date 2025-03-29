'use client'

import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import { cn } from '@/lib/Shared/utils'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/schemas/QuestionSchema'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Input from '@/src/components/Shared/form/Input'
import { Close } from '@radix-ui/react-popover'
import { Info, Pen, Plus } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { ReactNode } from 'react'

export default function QuestionsSection() {
  const { questions } = useCreateCheckStore((state) => state)

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
                    <h2 className=''>{question.question || `Question ${i + 1}`}</h2>
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
                <CreateQuestionDialog>
                  <div className='my-auto flex max-h-10 items-center gap-4 rounded-md p-3 hover:cursor-pointer dark:bg-neutral-600/70'>
                    <Pen className='size-4 dark:text-orange-400/70' />
                  </div>
                </CreateQuestionDialog>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center gap-8'>
        <CreateQuestionDialog>
          <div className='mx-4 flex w-72 items-center justify-center gap-2 rounded-md border-2 border-dashed border-blue-500/70 p-3 tracking-wider hover:cursor-pointer dark:border-neutral-300/70 dark:text-neutral-300 dark:hover:bg-neutral-500/30'>
            <Plus className='size-5' />
            Create Question
          </div>
        </CreateQuestionDialog>
      </div>
    </Card>
  )
}

export function QuestionPopoverOption({ icon, type }: { icon: IconName; type: Question['type'] }) {
  const { addQuestion } = useCreateCheckStore((state) => state)

  const handleClick = () => {
    const question: Question = {
      id: Math.random().toString(36).slice(2),
      type,
      question: '',
      points: 1,
      category: 'general',
      answers: [],
    }

    switch (type) {
      case 'single-choice':
        ;(question as ChoiceQuestion).answers = [
          { answer: 'Answer A', correct: false },
          { answer: 'Answer B', correct: false },
          { answer: 'Answer C', correct: false },
          { answer: 'Answer D', correct: false },
        ]
        break
      case 'multiple-choice':
        ;(question as ChoiceQuestion).answers = [
          { answer: 'Answer A', correct: false },
          { answer: 'Answer B', correct: false },
          { answer: 'Answer C', correct: false },
          { answer: 'Answer D', correct: false },
        ]
        break

      case 'open-question':
        ;(question as OpenQuestion).expectation = 'Expected Answer here'
        break

      case 'drag-drop':
        ;(question as DragDropQuestion).answers = [
          { answer: 'Answer A', position: 1 },
          { answer: 'Answer B', position: 2 },
          { answer: 'Answer C', position: 3 },
          { answer: 'Answer D', position: 4 },
        ]
        break
    }

    addQuestion(question)
  }
  return (
    <li>
      <Close
        onClick={handleClick}
        className={cn(
          'flex w-full items-center gap-4 rounded-md p-2 px-3 hover:cursor-pointer hover:ring-[1.5px]',
          'bg-neutral-300/60 ring-neutral-400/70',
          'ring-1 dark:bg-neutral-800/60 dark:text-neutral-200/80 dark:ring-neutral-600/80 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-200 dark:hover:ring-neutral-500/90',
        )}>
        <DynamicIcon name={icon} className='size-4' />
        {type
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}{' '}
        Question
      </Close>
    </li>
  )
}

function CreateQuestionDialog({ children }: { children: ReactNode }) {
  const { addQuestion } = useCreateCheckStore((state) => state)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md dark:border-neutral-600 dark:bg-neutral-800' id='question-dialog'>
        <form className='grid gap-6 py-1'>
          <DialogHeader className='border-b pb-3 text-left dark:border-b-neutral-500/80'>
            <DialogTitle>Create Question</DialogTitle>
            <DialogDescription>Create your new question for your KnowledgeCheck</DialogDescription>
          </DialogHeader>
          <input id='id' value={crypto.randomUUID()} onChange={() => null} className='hidden' />

          <div className='grid items-center gap-2'>
            <label htmlFor='question' className='dark:text-neutral-300/90'>
              Question
            </label>
            <Input id='question' placeholder='Formulate your question here' className='-ml-0.5 placeholder:text-[15px]' />
          </div>
          <div className='grid grid-cols-2 gap-12'>
            <div className='grid items-center gap-2'>
              <label htmlFor='points' className='dark:text-neutral-300/90'>
                Points
              </label>
              <Input id='points' type='number' placeholder='How many points is this question worth?' min={1} className='-ml-0.5 placeholder:text-[15px]' />
            </div>
            <div className='grid items-center gap-2'>
              <label htmlFor='type' className='dark:text-neutral-300/90'>
                Question Type
              </label>
              <Input id='type' placeholder='choice, open-question, ....' min={1} className='-ml-0.5 placeholder:text-[15px]' />
            </div>
          </div>
          <div className='grid items-center gap-2'>
            <label htmlFor='category' className='dark:text-neutral-300/90'>
              Category
            </label>
            <Input id='category' type='select' placeholder='What category does this question belong to?' defaultValue='general' className='-ml-0.5 placeholder:text-[15px]' />
          </div>
          <div className='grid items-center gap-2'>
            <label htmlFor='answers' className='dark:text-neutral-300/90'>
              Answering Options
            </label>
            <Input id='answers' placeholder='Formulate one possible answer to this question' className='-ml-0.5 placeholder:text-[15px]' />
            <button className='flex max-w-fit items-center gap-1 rounded-md py-1 dark:text-neutral-300/60'>
              <Plus className='size-4' />
              Add Answer
            </button>
          </div>
          <DialogFooter className='mt-4 grid grid-cols-2 gap-4'>
            <DialogClose asChild>
              <button className='rounded-md px-4 py-2 ring-2 hover:cursor-pointer dark:ring-red-400/30' type='button'>
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() =>
                addQuestion({
                  id: crypto.randomUUID(),
                  question: 'Some question',
                  category: 'general',
                  type: 'multiple-choice',
                  points: 10,
                  answers: [],
                })
              }
              className='dark:from:bg-blue-500/25 rounded-md bg-gradient-to-b from-blue-500/15 to-blue-700/20 px-4 py-2 ring-2 hover:cursor-pointer dark:ring-blue-400/30'
              type='submit'>
              Add
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
