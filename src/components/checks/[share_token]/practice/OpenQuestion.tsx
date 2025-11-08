import { HTMLProps } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { cn } from '@/src/lib/Shared/utils'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import type { OpenQuestion } from '@/src/schemas/QuestionSchema'

export function OpenQuestion({
  register,
  getFeedbackEvaluation,
  question,
  isEvaluated,
  ...props
}: {
  register: UseFormRegister<PracticeData>
  isEvaluated: boolean
  getFeedbackEvaluation: ReturnType<typeof import('@/src/hooks/checks/[share_token]/practice/usePracticeFeedback').usePracticeFeeback>
  question: OpenQuestion
} & Pick<HTMLProps<HTMLTextAreaElement>, 'disabled'>) {
  const { isCorrect, isIncorrect, reasoning } = getFeedbackEvaluation(question)

  return (
    <textarea
      disabled={isEvaluated}
      {...props}
      {...register('input')}
      title={reasoning}
      data-evaluation-result={isEvaluated ? (isCorrect ? 'correct' : isIncorrect ? 'wrong' : 'none') : 'none'}
      className={cn(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
        'enabled:hover:cursor-text enabled:hover:ring-neutral-500 enabled:focus:ring-[1.2px] enabled:focus:ring-neutral-700 enabled:dark:hover:ring-neutral-300/60 enabled:dark:focus:ring-neutral-300/80',
        'resize-none',
        'my-auto h-full',

        isEvaluated && 'relative ring-2',
        isCorrect && 'bg-radial from-neutral-700/60 via-neutral-700/60 to-green-500/15 dark:ring-green-500/70',
        isIncorrect && 'cursor-help bg-radial from-neutral-700/60 via-neutral-700/60 to-red-400/15 dark:ring-red-400/70',
      )}
    />
  )
}
