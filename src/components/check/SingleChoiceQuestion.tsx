import { Question } from '@/schemas/QuestionSchema'
import Card from '@/components/Shared/Card'
import { LayoutGrid } from 'lucide-react'

type SingleChoiceQuestion = Extract<Question, { type: 'single-choice' }>
type SingleChoiceAnswer = SingleChoiceQuestion['answers'][number]

export default function SingleChoiceQuestion({ id, type, question, points, category, answers }: SingleChoiceQuestion) {
  return (
    <Card className='question flex flex-col gap-6 pb-6 hover:bg-none' disableHoverStyles>
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
          <span className='text-sm dark:text-neutral-400'>{type}</span>
        </div>
      </div>
      <div className='flex flex-col gap-6 px-1'>
        {answers.map((answer, i) => (
          <ChoiceOption key={i} id={id} {...answer} />
        ))}
      </div>
    </Card>
  )
}

function ChoiceOption({ id, answer }: SingleChoiceAnswer & Pick<Question, 'id'>) {
  return (
    <label className='flex items-center gap-4 rounded-md p-3 px-4 ring-1 ring-neutral-200 hover:cursor-pointer has-checked:ring-2 dark:bg-neutral-700/40 dark:ring-neutral-500/80 dark:hover:bg-neutral-700/60 dark:has-checked:bg-neutral-600/80 dark:has-checked:ring-neutral-400/60'>
      <input
        type='radio'
        value={answer}
        name={id}
        className='size-3.5 appearance-none rounded-full ring-2 ring-blue-500 ring-offset-neutral-700 checked:mr-0.5 checked:size-3 checked:bg-neutral-300 checked:ring-2 checked:ring-neutral-300 checked:ring-offset-2 dark:ring-neutral-400'
      />

      <span className='flex-1'>{answer}</span>
    </label>
  )
}
