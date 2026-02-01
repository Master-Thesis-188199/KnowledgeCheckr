import { HTMLProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { usePracticeFeeback } from '@/src/hooks/checks/[share_token]/practice/usePracticeFeedback'
import { cn } from '@/src/lib/Shared/utils'
import type { OpenQuestion } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'

export function OpenQuestion({
  getFeedbackEvaluation,
  question,
  isEvaluated,
  ...props
}: {
  isEvaluated: boolean
  getFeedbackEvaluation: ReturnType<typeof usePracticeFeeback>
  question: OpenQuestion
} & Pick<HTMLProps<HTMLTextAreaElement>, 'disabled'>) {
  const { register } = useFormContext<QuestionInput>()
  const { isCorrect, isIncorrect, reasoning } = getFeedbackEvaluation(question)

  return (
    <textarea
      disabled={isEvaluated}
      {...props}
      {...register('input')}
      title={reasoning}
      data-evaluation-result={isEvaluated ? (isCorrect ? 'correct' : isIncorrect ? 'incorrect' : 'none') : 'none'}
      className={cn(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
        'enabled:focus:ring-ring-focus enabled:dark:focus:ring-ring-focus enabled:hover:ring-ring-hover enabled:dark:hover:ring-ring-hover enabled:hover:cursor-text enabled:focus:ring-[1.2px]',
        'resize-none',
        'my-auto h-full',

        isEvaluated && 'relative ring-2',
        isCorrect && 'bg-radial from-neutral-200/60 via-neutral-200/60 to-green-500/20 ring-green-400/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-green-500/15 dark:ring-green-500/70',
        isIncorrect &&
          'cursor-help bg-radial from-neutral-200/60 via-neutral-200/60 to-red-500/20 ring-red-500/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-red-400/15 dark:ring-red-400/70',
      )}
    />
  )
}
