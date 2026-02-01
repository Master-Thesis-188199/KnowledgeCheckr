import { CircleIcon } from 'lucide-react'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion } from '@/src/schemas/QuestionSchema'

export default function DisplayChoiceQuestionAnswer({
  type,
  answer,
  index,
  onChange,
  defaultChecked,
  className,
  iconClassname,
  children,
}: {
  type: ChoiceQuestion['type']
  index: number
  answer: ChoiceQuestion['answers'][number]
  onChange: (props: { selected: boolean; answer: ChoiceQuestion['answers'][number]; answerIndex: number }) => void
  defaultChecked?: (props: { answer: ChoiceQuestion['answers'][number]; answerIndex: number }) => boolean | undefined
  className?: string
  iconClassname?: string
  children?: React.ReactNode
}) {
  return (
    <label className={cn('flex items-center gap-2 hover:cursor-pointer', className)}>
      <input
        className='peer hidden'
        type={type === 'multiple-choice' ? 'checkbox' : 'radio'}
        name={type === 'single-choice' ? 'answer.correct' : (`answers.${index}.correct` as const)}
        defaultChecked={defaultChecked ? defaultChecked({ answer, answerIndex: index }) : undefined}
        onChange={(e) => onChange({ selected: e.target.checked, answer, answerIndex: index })}
      />
      <CircleIcon className={cn('size-4.5 peer-checked:fill-neutral-400 dark:peer-checked:fill-neutral-300', iconClassname)} />
      {answer.answer}

      {children}
    </label>
  )
}
