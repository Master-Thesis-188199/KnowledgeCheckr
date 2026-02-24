import { HTMLProps, useEffect, useState } from 'react'
import { MessageCircleQuestionIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import DisplayFeedbackText from '@/src/components/checks/[share_token]/practice/FeedbackText'
import { usePracticeFeeback } from '@/src/hooks/checks/[share_token]/practice/usePracticeFeedback'
import { useRHFContext } from '@/src/hooks/Shared/form/react-hook-form/RHFProvider'
import { cn } from '@/src/lib/Shared/utils'
import type { OpenQuestion } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'

export function FeedbackOpenQuestion({
  question,
  ...props
}: {
  question: OpenQuestion
} & Pick<HTMLProps<HTMLTextAreaElement>, 'disabled'>) {
  const { isValidationComplete, state } = useRHFContext<QuestionInput>(true)

  const getFeedbackEvaluation = usePracticeFeeback(state, {
    isSubmitSuccessful: isValidationComplete,
    isSubmitted: isValidationComplete,
    isPending: false,
    isSubmitting: false,
  })

  const { isCorrect, isIncorrect, reasoning } = getFeedbackEvaluation(question)
  const [isPinned, setPinned] = useState(false)

  useEffect(() => {
    if (!isValidationComplete || isCorrect) return

    // toggle feedback-text display when answer is incorrect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPinned(true)
  }, [isValidationComplete])

  return (
    <OpenQuestionAnswer
      {...props}
      disabled={isValidationComplete || props.disabled}
      data-evaluation-result={isValidationComplete ? (isCorrect ? 'correct' : isIncorrect ? 'incorrect' : 'none') : 'none'}
      className={cn(
        isValidationComplete && 'relative ring-2',
        isCorrect && 'bg-radial from-neutral-200/60 via-neutral-200/60 to-green-500/20 ring-green-400/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-green-500/15 dark:ring-green-500/70',
        isIncorrect && 'bg-radial from-neutral-200/60 via-neutral-200/60 to-red-500/20 ring-red-500/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-red-400/15 dark:ring-red-400/70',
        isValidationComplete && 'pr-8',
      )}>
      <div className={cn('group/tooltip absolute top-1 right-1.5 z-10 flex cursor-pointer flex-row-reverse gap-1.5')} onClick={() => setPinned((prev) => !prev)}>
        <DisplayFeedbackText disabled={!isValidationComplete} pinned={isPinned} feedback={reasoning} side='right'>
          <MessageCircleQuestionIcon
            className={cn('size-4.5 text-warning', !isPinned ? 'not-group-hover/tooltip:group-hover:animate-scale' : 'scale-110', !isValidationComplete && 'hidden', !reasoning && 'hidden')}
          />
        </DisplayFeedbackText>
      </div>
      {/* overlay to detect click-events in text-area while disabled */}
      {isValidationComplete && <div className='absolute inset-0 cursor-pointer' onClick={() => setPinned((prev) => !prev)}></div>}
    </OpenQuestionAnswer>
  )
}

export function OpenQuestionAnswer({ children, ...props }: { children?: React.ReactNode } & HTMLProps<HTMLTextAreaElement>) {
  const { register } = useFormContext<QuestionInput>()

  return (
    <div className='group relative *:w-full'>
      <textarea
        {...props}
        {...register('input')}
        className={cn(
          'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
          'enabled:hover:cursor-text enabled:hover:ring-ring-hover enabled:focus:ring-[1.2px] enabled:focus:ring-ring-focus enabled:dark:hover:ring-ring-hover enabled:dark:focus:ring-ring-focus',
          'resize-none',
          'my-auto h-full min-h-32',
          props.className,
        )}
      />
      {children}
    </div>
  )
}
