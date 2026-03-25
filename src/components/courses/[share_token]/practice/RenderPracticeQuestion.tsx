'use client'

import { useEffect, useState } from 'react'
import React, { HTMLProps } from 'react'
import { motion, Variants } from 'framer-motion'
import cloneDeep from 'lodash/cloneDeep'
import { MessageCircleQuestionIcon } from 'lucide-react'
import { CheckIcon, XIcon } from 'lucide-react'
import { notFound, redirect, usePathname } from 'next/navigation'
import { UseFormRegister } from 'react-hook-form'
import { FeedbackOpenQuestion } from '@/src/components/courses/[share_token]/(shared)/(questions)/OpenQuestionAnswer'
import DragDropAnswers from '@/src/components/courses/[share_token]/practice/DragDropAnswerOptions'
import DisplayFeedbackText from '@/src/components/courses/[share_token]/practice/FeedbackText'
import { usePracticeStore } from '@/src/components/courses/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { usePracticeFeeback } from '@/src/hooks/courses/[share_token]/practice/usePracticeFeedback'
import { useLogger } from '@/src/hooks/log/useLogger'
import { RHFProvider, useRHFContext } from '@/src/hooks/Shared/form/react-hook-form/RHFProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { EvaluateAnswer } from '@/src/lib/courses/[share_token]/practice/EvaluateAnswer'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion, Question } from '@/src/schemas/QuestionSchema'
import { QuestionInput, QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { Any } from '@/types'

export function RenderPracticeQuestion() {
  const { practiceQuestions: questions, questions: unfilteredQuestions, currentQuestionIndex, navigateToQuestion, storeAnswer } = usePracticeStore((store) => store)
  const pathname = usePathname()
  const logger = useLogger('RenderPracticeQuestion')

  const question = questions.at(currentQuestionIndex)

  if (questions.length === 0 && unfilteredQuestions.length > 0) {
    console.debug('No `practiceQuestions` set based on category, redirecting user.')
    redirect(pathname + '/category')
  } else if (!question) {
    notFound()
  }

  const RHFForm = useRHF(
    QuestionInputSchema,
    {
      // Warning: Type assertion is intentional.
      // By setting the question_id and type, the form-values are (re-) set when the question changes, setting `values` makes the form controlled.
      values: { question_id: question.id, type: question.type } as QuestionInput,
    },
    { serverAction: EvaluateAnswer, initialActionState: { success: false } },
  )

  const {
    form: {
      formState: { isValid, isSubmitting },
      ...form
    },
    isValidationComplete,
    isServerValidationPending: isPending,
    state,
    runServerValidation,
  } = RHFForm

  const nextRandomQuestion = () =>
    questions.length > 1
      ? navigateToQuestion((currentQuestionIndex + 1) % questions.length)
      : // allow the same (only) question to be answered again and again.
        form.reset({ question_id: question.id, type: question.type as Any })

  const onSubmit = (_data: QuestionInput) => {
    logger.verbose('Submitting practice answer...', _data)
    runServerValidation(_data)

    storeAnswer(cloneDeep({ ...form.getValues(), question_id: question.id }))
    console.info(`[Submit] '${question.question}' has been answered & submitted`)
  }

  return (
    <RHFProvider {...RHFForm}>
      <form id='practice-form' data-question-id={question.id} data-question-type={question.type} className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='my-8 flex flex-col items-center justify-center gap-2'>
          <div className='flex items-center gap-4'>
            <div className='flex size-6 items-center justify-center rounded-full p-1.5 text-sm font-semibold ring-1 ring-neutral-700 dark:ring-neutral-200'>{currentQuestionIndex + 1}</div>
            <h2 className='text-2xl font-semibold'>{question.question}</h2>
          </div>
          <span className='text-neutral-600 dark:text-neutral-300'>{getQuestionActionDescriptor(question.type)}</span>
        </div>

        <div id='answer-options' className={cn('grid min-h-[35vh] min-w-[25vw] grid-cols-2 gap-8 rounded-md p-6 ring-1 ring-ring dark:ring-ring', question?.type === 'open-question' && 'grid-cols-1')}>
          {
            //prettier-ignore
            (question.type === 'single-choice' || question.type === 'multiple-choice') && 
              <ChoiceAnswerOptions type={question.type === 'single-choice' ? 'radio' : 'checkbox'} question={question} />
          }

          {question.type === 'drag-drop' && <DragDropAnswers question={question} />}

          {question.type === 'open-question' && <FeedbackOpenQuestion question={question} />}
        </div>

        <FeedbackLegend
          disabled={(!isValidationComplete && !(question.type === 'single-choice' || question.type === 'multiple-choice')) || question.id !== state.values?.question_id}
          show={isValidationComplete && (question.type === 'single-choice' || question.type === 'multiple-choice')}
        />

        <div className='flex justify-center'>
          <Button
            title={!isValid ? 'Before checking this question you must first answer it' : undefined}
            disabled={!isValid}
            hidden={isValidationComplete}
            className='mt-2'
            variant='base'
            isLoading={isSubmitting || isPending}
            type='submit'>
            Check Answer
          </Button>

          <Button hidden={!isValidationComplete} className='mx-auto mt-2' variant='success' onClick={nextRandomQuestion} type='button'>
            Continue
          </Button>
        </div>
      </form>
    </RHFProvider>
  )
}

function getQuestionActionDescriptor(question_type: Question['type']) {
  switch (question_type) {
    case 'single-choice':
      return 'Pick one answer-option from these options'
    case 'multiple-choice':
      return 'Pick one or more answers from these options'
    case 'drag-drop':
      return 'Arrange these options in the correct order'
    case 'open-question':
      return 'Write your answer into the designated field'
  }
}

function FeedbackLegend({ show, disabled }: { show: boolean; disabled?: boolean }) {
  const variants: Variants = {
    show: {
      opacity: 100,
      translateY: 0,
      display: 'grid',
      transition: {
        duration: 0.5,
      },
    },
    hide: {
      display: 'none',
      opacity: 0,
      translateY: -5,
    },
  }
  if (disabled) return null

  return (
    <motion.div variants={variants} initial='hide' animate={show ? 'show' : 'hide'} className={cn('result-legend mx-auto grid h-auto grid-cols-2 gap-x-8 gap-y-3')}>
      <div className='flex items-center gap-2'>
        <div className='size-3 bg-green-500/70 dark:bg-green-400/70' />
        <div className='text-green-700 dark:text-green-400/70' children='Correctly answered' />
      </div>
      <div className='flex items-center gap-2'>
        <div className='size-3 bg-yellow-500/70 dark:bg-yellow-400/70' />
        <div className='text-yellow-600 dark:text-yellow-400/70' children='Correct (missing)' />
      </div>
      <div className='col-span-2 flex items-center justify-center gap-2'>
        <div className='size-3 bg-red-500/70 dark:bg-red-400/70' />
        <div className='text-red-500/60 dark:text-red-400/70' children='Wrong answer' />
      </div>
    </motion.div>
  )
}

/**
 * Renders feedback-indicators in the form of icons that are positioned at the top right of an answer-option indicate whether the user made the correct selection.
 */
function FeedbackIndicators({ correctlySelected, missingSelection, falslySelected }: { correctlySelected?: boolean; missingSelection?: boolean; falslySelected?: boolean }) {
  return (
    <>
      <CheckIcon className={cn('hidden size-5 text-green-400 dark:text-green-500', correctlySelected && 'block')} />
      <XIcon className={cn('hidden size-5 text-red-400 dark:text-red-500', falslySelected && 'block')} />
      <CheckIcon className={cn('hidden size-5 text-yellow-400/80 dark:text-yellow-500/80', missingSelection && 'block')} />
    </>
  )
}

/**
 * This component renders the answer-options for ChoiceQuestions as they are almost identical, to reduce code duplication
 */
function ChoiceAnswerOptions<Q extends ChoiceQuestion>({ question, type }: { type: Required<HTMLProps<HTMLInputElement>['type']>; question: Q }) {
  const {
    isValidationComplete,
    state,
    form: {
      register,
      formState: { errors },
    },
  } = useRHFContext<QuestionInput>(true)
  const registerKey: (index: number) => Parameters<UseFormRegister<QuestionInput>>['0'] = question.type === 'multiple-choice' ? (i) => `selection.${i}` : () => `selection`

  const getFeedbackEvaluation = usePracticeFeeback(state, {
    isSubmitSuccessful: isValidationComplete,
    isSubmitted: isValidationComplete,
    isPending: false,
    isSubmitting: false,
  })

  const { isCorrectlySelected, isFalslySelected, isMissingSelection, reasoning } = getFeedbackEvaluation(question)
  const [openFeedbacks, setOpenFeedbacks] = useState<ChoiceQuestion['answers'][number]['id'][]>([])

  // auto-opens feedback-text tooltips for wrongfully selected answer-options
  useEffect(() => {
    if (openFeedbacks.length > 0) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenFeedbacks([question.answers.find((a) => isFalslySelected(a))?.id ?? ''].filter(Boolean))
  }, [isValidationComplete])

  return question.answers.map((a, i) => {
    const handleActivate = () => {
      if (isValidationComplete) {
        setOpenFeedbacks((prev) => (prev.includes(a.id) ? prev.filter((id) => id !== a.id) : prev.concat([a.id])))
        return
      }

      const input = document.getElementById(a.id) as HTMLInputElement | null
      if (!input || input.disabled) return

      input.focus()
      input.click()
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLLabelElement> = (event) => {
      const answerId = event.currentTarget.htmlFor
      // close the feedback-tooltip when escape is pressed while the option for which the feedback is shown is focussed
      if (event.key === 'Escape' && openFeedbacks.includes(answerId)) return setOpenFeedbacks((prev) => prev.filter((id) => id !== answerId))
      if (event.key !== 'Enter' && event.key !== ' ') return

      event.preventDefault()
      handleActivate()
    }

    return (
      <ChoiceOption
        key={a.id}
        onClick={isValidationComplete ? handleActivate : undefined}
        onKeyDown={handleKeyDown}
        mode={isValidationComplete ? 'feedback' : 'input'}
        isCorrect={isValidationComplete && isCorrectlySelected(a)}
        isWrong={isValidationComplete && isFalslySelected(a)}
        isMissing={isValidationComplete && isMissingSelection(a)}
        feedbackText={reasoning?.get(a.id)}
        className={cn(isValidationComplete && !reasoning?.has(a.id) && 'pointer-events-none')}
        htmlFor={a.id}>
        {a.answer}

        <DisplayFeedbackText
          updateOpenTooltips={setOpenFeedbacks}
          openTooltips={openFeedbacks}
          answerId={a.id}
          disabled={!isValidationComplete}
          answerIndex={i}
          pinned={openFeedbacks.includes(a.id)}
          feedback={reasoning?.get(a.id)}
          side={i % 2 === 1 ? 'right' : 'left'}>
          <div className={cn('group/tooltip absolute top-1 right-1.5 flex flex-row-reverse gap-1.5', i % 2 === 0 && 'left-1.5 flex-row justify-between')}>
            <MessageCircleQuestionIcon
              className={cn(
                'size-4.5 text-warning',
                !openFeedbacks.includes(a.id) ? 'not-group-hover/tooltip:group-hover:animate-scale' : 'scale-110',
                !isValidationComplete && 'hidden',
                !reasoning?.get(a.id) && 'hidden',
              )}
            />
            <FeedbackIndicators correctlySelected={isCorrectlySelected(a)} missingSelection={isMissingSelection(a)} falslySelected={isFalslySelected(a)} />
          </div>
        </DisplayFeedbackText>

        <input
          className='hidden'
          id={a.id}
          type={type}
          {...register(registerKey(i))}
          disabled={isValidationComplete}
          value={a.id}
          data-evaluation-result={isValidationComplete ? (isCorrectlySelected(a) ? 'correct' : isFalslySelected(a) ? 'incorrect' : isMissingSelection(a) ? 'missing' : 'none') : 'none'}
        />

        <FormFieldError field={registerKey(i)} errors={errors} />
      </ChoiceOption>
    )
  })
}

function ChoiceOption({
  mode,
  feedbackText,
  isCorrect,
  isWrong,
  isMissing,
  ...props
}: React.ComponentProps<'label'> & {
  mode: 'feedback' | 'input'
  feedbackText?: string
  isCorrect?: boolean
  isWrong?: boolean
  isMissing?: boolean
}) {
  return (
    <label
      data-feedback={mode === 'feedback' ? (isCorrect ? 'correct' : isWrong ? 'incorrect' : isMissing ? 'missing' : undefined) : 'answering'}
      tabIndex={mode === 'input' ? 0 : mode === 'feedback' && !!feedbackText ? 0 : -1}
      {...props}
      className={cn(
        'rounded-md border border-neutral-400 bg-neutral-100/90 px-3 py-1.5 text-neutral-600 outline-none placeholder:text-neutral-400/90 dark:border-neutral-500 dark:bg-neutral-800 dark:text-neutral-300/80 dark:placeholder:text-neutral-400/50',
        'has-enabled:hover:cursor-pointer has-enabled:hover:border-ring-hover has-enabled:dark:hover:border-ring-hover',
        'has-enabled:focus:border-[1.2px] has-enabled:focus:border-ring-focus has-enabled:dark:focus:border-ring-focus',
        'flex items-center justify-center',
        'resize-none select-none',
        'has-enabled:has-checked:border-[1.5px] has-enabled:has-checked:border-ring-hover has-enabled:has-checked:bg-neutral-200/60 has-enabled:has-checked:font-semibold dark:has-enabled:has-checked:border-neutral-300 dark:has-enabled:has-checked:bg-neutral-700/60',
        'focus-visible:ring-[3px] data-[feedback=answering]:focus-visible:border-ring-hover data-[feedback=answering]:focus-visible:ring-ring-hover/50',
        'data-[feedback=correct]:focus-visible:border-success-400 data-[feedback=correct]:focus-visible:ring-success-300/50',
        'data-[feedback=incorrect]:focus-visible:border-destructive-300/80 data-[feedback=incorrect]:focus-visible:ring-destructive-300/50 dark:data-[feedback=incorrect]:focus-visible:border-destructive-400',
        'data-[feedback=missing]:focus-visible:border-0 data-[feedback=missing]:focus-visible:border-warning-400 data-[feedback=missing]:focus-visible:ring-warning/60 dark:data-[feedback=missing]:focus-visible:ring-warning-300/50',

        mode === 'feedback' &&
          cn(
            'relative border-2',
            !!feedbackText && 'group cursor-pointer',
            isCorrect &&
              'border-success-300 bg-radial from-neutral-200/60 via-neutral-100/60 to-success-200/50 to-99% font-semibold dark:border-green-500/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-green-500/20',

            isWrong &&
              'border-red-500/70 from-neutral-200/60 via-neutral-100/60 to-destructive/10 has-checked:bg-radial has-checked:font-semibold dark:border-red-400/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-red-400/20',

            isMissing && 'border-0 outline-2 outline-yellow-500 outline-dashed focus-visible:border dark:outline-yellow-400/60',
          ),

        props.className,
      )}
    />
  )
}
