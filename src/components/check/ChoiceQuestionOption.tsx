'use client'

import { ChoiceQuestion } from '@/schemas/QuestionSchema'
import { useQuestionSelectionContext } from '@/components/check/QuestionSelectionProvider'
import { twMerge } from 'tailwind-merge'

type ChoiceAnswer = ChoiceQuestion['answers'][number]

export default function ChoiceQuestionOption({ answer }: ChoiceAnswer) {
  const { isSelected, toggleSelection, maxSelection, selection } = useQuestionSelectionContext()

  return (
    <label className='relative flex items-center gap-4 rounded-md bg-neutral-300/40 p-3 px-4 ring-1 ring-neutral-400/50 select-none hover:cursor-pointer hover:bg-neutral-300/60 has-checked:bg-neutral-300/80 has-checked:ring-2 has-checked:ring-neutral-400/80 dark:bg-neutral-700/40 dark:ring-neutral-500/80 dark:hover:bg-neutral-700/60 dark:has-checked:bg-neutral-600/80 dark:has-checked:ring-neutral-400/60'>
      <input
        type='checkbox'
        onChange={() => {}}
        checked={isSelected(answer)}
        onClick={() => toggleSelection(answer)}
        className={twMerge(
          'size-3.5 appearance-none rounded-full ring-2 ring-neutral-500 ring-offset-neutral-600 checked:mr-0.5 checked:size-3 checked:bg-neutral-400/80 checked:ring-2 checked:ring-neutral-300 checked:ring-offset-2 dark:ring-neutral-400 dark:ring-offset-neutral-700 dark:checked:bg-neutral-300',
        )}
      />

      <span className='flex-1'>{answer}</span>
      <div
        className={twMerge(
          'absolute top-0 right-0 rounded-tr-md rounded-bl-lg p-1.5 text-xs dark:bg-neutral-700 dark:text-neutral-300/80',
          selection.length >= (maxSelection || 0) ? 'bg-red-400/20 text-red-700/80 dark:bg-red-700/20 dark:text-red-200/70' : '',
          (maxSelection === undefined || selection.length === 0) && 'hidden',
          maxSelection === 1 && 'hidden', // Single Choice Questions
          !isSelected(answer) && 'hidden',
        )}>
        {selection.length} / {maxSelection}
      </div>
    </label>
  )
}
