import { Question } from '@/schemas/QuestionSchema'
import Card from '@/components/Shared/Card'
import { LayoutGrid } from 'lucide-react'
import QuestionSelectionProvider from '@/components/check/QuestionSelectionProvider'
import ChoiceQuestionOption from '@/components/check/ChoiceQuestionOption'

export type ChoiceQuestion = Extract<Question, { type: 'single-choice' | 'multiple-choice' }>

/**
 * This component renders a choice question and allows the user to select between its answers.
 * @param maxChoices Defines the maximum number of answers the user can select. If undefined, the user can select as many as they want.
 */
export default function ChoiceQuestion({ id, type, question, points, category, answers, maxChoices }: ChoiceQuestion & { maxChoices?: number }) {
  return (
    <QuestionSelectionProvider maxSelection={maxChoices ? maxChoices : type === 'single-choice' ? 1 : undefined} autoSwitchAnswer={maxChoices === 1 || type === 'single-choice'}>
      <Card className='question flex flex-col gap-6 hover:bg-none' disableHoverStyles>
        <div className='header mb-2 flex flex-col border-b border-neutral-400 p-2 dark:border-neutral-500'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg'>Question X</h2>
            <span className='dark:text-neutral-200'>
              {points} point{points > 1 && 's'}
            </span>
          </div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-1 text-sm text-neutral-400 dark:text-neutral-400'>
              <LayoutGrid className='size-3 stroke-neutral-400' />
              <span className='lowercase'>{category}</span>
            </div>
            <span className='text-sm text-neutral-400 dark:text-neutral-400'>{type}</span>
          </div>
        </div>

        <div className='-mt-4 px-2 tracking-wide'>{question}</div>

        <div className='flex flex-col gap-6 px-1'>
          {answers.map((answer, i) => (
            <ChoiceQuestionOption key={i} id={id} {...answer} />
          ))}
        </div>
      </Card>
    </QuestionSelectionProvider>
  )
}
