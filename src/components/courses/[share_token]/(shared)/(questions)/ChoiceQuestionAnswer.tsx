import { CircleIcon } from 'lucide-react'
import { useFormContext, UseFormRegister } from 'react-hook-form'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'

export default function DisplayChoiceQuestionAnswer<Type extends ChoiceQuestion['type']>({
  type,
  answer: { answer, id },
  className,
  iconClassname,
  children,
  registerKey,
}: {
  type: Type
  answer: Pick<ChoiceQuestion['answers'][number], 'answer' | 'id'>
  registerKey: Parameters<UseFormRegister<Extract<QuestionInput, { type: Type }>>>['0']
  className?: string
  iconClassname?: string
  children?: React.ReactNode
}) {
  const { register } = useFormContext<Extract<QuestionInput, { type: Type }>>()

  return (
    <label className={cn('flex items-center gap-2 hover:cursor-pointer', className)}>
      <input className='peer hidden' type={type === 'multiple-choice' ? 'checkbox' : 'radio'} {...register(registerKey)} value={id} />
      <CircleIcon className={cn('size-4.5 peer-checked:fill-neutral-400 dark:peer-checked:fill-neutral-300', iconClassname)} />
      {answer}

      {children}
    </label>
  )
}
