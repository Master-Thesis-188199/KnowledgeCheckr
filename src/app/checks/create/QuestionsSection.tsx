import Card from '@/components/Shared/Card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Shared/Popover'
import { Info, Plus } from 'lucide-react'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { cn } from '@/lib/Shared/utils'
import React from 'react'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/schemas/QuestionSchema'
import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import { Close } from '@radix-ui/react-popover'

export default function QuestionsSection() {
  return (
    <Card disableHoverStyles className='break-inside-avoid'>
      <div className='header -m-3 mb-0 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>Questions</h2>
        </div>
      </div>
      <div className='questions'>
        <div className='if-no-questions-show-empty-container my-20 flex flex-col items-center justify-center gap-6'>
          <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
          <span className='tracking-wide text-neutral-500 dark:text-neutral-400'>Currently there are no questions associated to this quiz</span>
        </div>
      </div>
      <div className='flex justify-center gap-8'>
        <Popover>
          <PopoverTrigger className='mx-4 flex w-72 items-center justify-center gap-2 rounded-md border-2 border-dashed border-blue-500/70 p-3 tracking-wider hover:cursor-pointer dark:border-neutral-300/70 dark:text-neutral-300 dark:hover:bg-neutral-500/30'>
            <Plus className='size-5' />
            Add Question
          </PopoverTrigger>

          <PopoverContent side='bottom' sideOffset={20} className='border-0 p-0 dark:bg-neutral-900'>
            <div className='rounded-md border border-neutral-400/40 bg-neutral-200 p-3.5 shadow-md shadow-neutral-300 dark:border-neutral-600 dark:bg-neutral-700/50 dark:text-neutral-200 dark:shadow-neutral-900'>
              <ul className='space-y-4'>
                <QuestionPopoverOption type='single-choice' icon='mouse-pointer' />
                <QuestionPopoverOption type='multiple-choice' icon='list' />
                <QuestionPopoverOption type='open-question' icon='type' />
                <QuestionPopoverOption type='drag-drop' icon='square-dashed-mouse-pointer' />
              </ul>
            </div>
          </PopoverContent>
        </Popover>
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
      points: 0,
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
