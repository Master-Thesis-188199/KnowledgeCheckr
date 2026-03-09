import React, { HTMLProps, useEffect, useState } from 'react'
import { MessageCircleQuestionIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import DisplayFeedbackText from '@/src/components/checks/[share_token]/practice/FeedbackText'
import { Textarea } from '@/src/components/shadcn/textarea'
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

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!isValidationComplete) return

    // close the feedback-tooltip when escape is pressed while the option for which the feedback is shown is focussed
    if (event.key === 'Escape' && isPinned) return setPinned(false)
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    setPinned((prev) => !prev)
  }

  return (
    <div
      className={cn(
        'group relative rounded-md *:w-full focus-visible:ring-[5px]',
        isIncorrect && 'ring-destructive-300/40 dark:ring-destructive-400/40',
        isCorrect && 'ring-success-300/40 dark:ring-success/40',
      )}
      onKeyDown={handleKeyDown}
      tabIndex={isValidationComplete && !!reasoning ? 0 : -1}>
      <OpenQuestionAnswer
        {...props}
        disabled={isValidationComplete || props.disabled}
        data-evaluation-result={isValidationComplete ? (isCorrect ? 'correct' : isIncorrect ? 'incorrect' : 'none') : 'none'}
        className={cn(
          isValidationComplete && 'relative ring-2',
          isCorrect &&
            'bg-radial from-neutral-200/60 via-neutral-200/60 to-success-200/50 ring-success-300 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-green-500/15 dark:ring-green-500/70',
          isIncorrect && 'bg-radial from-neutral-200/60 via-neutral-200/60 to-destructive/10 ring-red-500/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-red-400/15 dark:ring-red-400/70',
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
    </div>
  )
}

export function OpenQuestionAnswer({ children, ...props }: { children?: React.ReactNode } & React.ComponentProps<typeof Textarea>) {
  const { register } = useFormContext<QuestionInput>()

  return (
    <>
      <Textarea
        {...props}
        maxRows={-1}
        {...register('input')}
        className={cn(
          'rounded-md border border-neutral-400 bg-neutral-100/90 px-3 py-1.5 text-neutral-600 outline-none placeholder:text-neutral-400/90 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300/80 dark:placeholder:text-neutral-400/50',
          'enabled:hover:cursor-text enabled:hover:border-ring-hover enabled:focus:border-[1.2px] enabled:focus:border-ring-focus enabled:dark:hover:border-ring-hover enabled:dark:focus:border-ring-focus',
          'resize-none',
          'my-auto h-full min-h-32',
          props.className,
        )}
      />
      {children}
    </>
  )
}
