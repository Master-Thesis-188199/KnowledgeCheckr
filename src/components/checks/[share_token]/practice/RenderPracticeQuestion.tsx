'use client'

import { useEffect, useState } from 'react'
import React, { HTMLProps } from 'react'
import { motion, Variants } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'
import { LoaderCircleIcon } from 'lucide-react'
import { CheckIcon, XIcon } from 'lucide-react'
import { notFound, redirect, usePathname } from 'next/navigation'
import { useFormContext } from 'react-hook-form'
import { UseFormRegister } from 'react-hook-form'
import { FeedbackOpenQuestion } from '@/src/components/checks/[share_token]/(shared)/(questions)/OpenQuestionAnswer'
import DragDropAnswers from '@/src/components/checks/[share_token]/practice/DragDropAnswerOptions'
import DisplayFeedbackText from '@/src/components/checks/[share_token]/practice/FeedbackText'
import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import { Form } from '@/src/components/shadcn/form'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { usePracticeFeeback } from '@/src/hooks/checks/[share_token]/practice/usePracticeFeedback'
import { useLogger } from '@/src/hooks/log/useLogger'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { EvaluateAnswer } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion, Question, SingleChoice } from '@/src/schemas/QuestionSchema'
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

  const {
    form,
    isServerValidationPending: isPending,
    state,
    runServerValidation,
  } = useRHF(
    QuestionInputSchema,
    {
      defaultValues: () => ({ question_id: question.id, type: question.type }),
    },
    { serverAction: EvaluateAnswer, initialActionState: { success: false } },
  )
  const {
    watch,
    formState: { isSubmitting, isValid, isSubmitted, isSubmitSuccessful, errors },
  } = form

  const nextRandomQuestion = () =>
    questions.length > 1
      ? navigateToQuestion((currentQuestionIndex + 1) % questions.length)
      : // allow the same (only) question to be answered again and again.
        form.reset()

  useEffect(() => {
    if (!isSubmitSuccessful) return
    if (isPending) return
    if (isSubmitting) return

    console.info(question.question, ' has been answered & submitted')
    storeAnswer({ ...form.getValues(), question_id: question.id })
  }, [isSubmitSuccessful, isPending, isSubmitting])

  const getFeedbackEvaluation = usePracticeFeeback(state, { isSubmitSuccessful, isPending, isSubmitted, isSubmitting })
  const isEvaluated = isSubmitted && isSubmitSuccessful && (!isSubmitting || !isPending) && !isPending

  //* Handle reseting form inputs when question changes
  useEffect(() => {
    if (watch('type') === question.type && watch('question_id') === question.id) return
    else {
      //* When the question is changed reset the form (and set the new question id and type)
      form.reset({ question_id: question.id, type: question.type as Any })
      return
    }
  }, [question.id, question.type])

  const onSubmit = (_data: QuestionInput) => {
    logger.verbose('Submitting practice answer...', _data)
    runServerValidation(_data)
  }

  useEffect(() => {
    const sub = watch((values, { name }) => {
      console.debug(`[${name ?? 'Form-State (validation)'}] changed`, values)
    })

    return () => sub.unsubscribe()
  })

  if (!isEmpty(errors)) console.log('error', errors)

  return (
    <Form {...form}>
      <form id='practice-form' data-question-id={question.id} data-question-type={question.type} className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='my-8 flex flex-col items-center justify-center gap-2'>
          <div className='flex items-center gap-4'>
            <div className='flex size-6 items-center justify-center rounded-full p-1.5 text-sm font-semibold ring-1 ring-neutral-700 dark:ring-neutral-200'>{currentQuestionIndex + 1}</div>
            <h2 className='text-2xl font-semibold'>{question.question}</h2>
          </div>
          <span className='text-neutral-600 dark:text-neutral-300'>{getQuestionActionDescriptor(question.type)}</span>
        </div>

        <div id='answer-options' className={cn('grid min-h-[35vh] min-w-[25vw] grid-cols-2 gap-8 rounded-md p-6 ring-1 ring-ring dark:ring-ring', question?.type === 'open-question' && 'grid-cols-1')}>
          {question.type === 'multiple-choice' && (
            <ChoiceAnswerOption type='checkbox' registerKey={(i) => `selection.${i}`} question={question} getFeedbackEvaluation={getFeedbackEvaluation} isEvaluated={isEvaluated} />
          )}

          {question.type === 'single-choice' && (
            <ChoiceAnswerOption type='radio' registerKey={() => 'selection'} question={question} getFeedbackEvaluation={getFeedbackEvaluation} isEvaluated={isEvaluated} />
          )}

          {question.type === 'drag-drop' && <DragDropAnswers question={question} isEvaluated={isEvaluated} state={state} />}

          {question.type === 'open-question' && (
            <FeedbackOpenQuestion isEvaluated={isEvaluated} getFeedbackEvaluation={getFeedbackEvaluation} question={question} disabled={isSubmitted && isSubmitSuccessful && !isPending} />
          )}
        </div>

        <FeedbackLegend
          disabled={(!isEvaluated && !(question.type === 'single-choice' || question.type === 'multiple-choice')) || question.id !== state.values?.question_id}
          show={isSubmitSuccessful && isSubmitted && !(isSubmitting || isPending) && (question.type === 'single-choice' || question.type === 'multiple-choice')}
        />

        <div className='flex justify-center'>
          <Button
            title={!isValid ? 'Before checking this question you must first answer it' : undefined}
            disabled={!isValid}
            hidden={isSubmitted && isSubmitSuccessful && !isPending}
            className='mx-auto mt-2 bg-neutral-300/80 enabled:ring-1 enabled:ring-ring-subtle enabled:hover:bg-neutral-300 enabled:hover:ring-ring dark:bg-neutral-700 dark:enabled:ring-transparent dark:enabled:hover:bg-neutral-600 dark:enabled:hover:ring-ring'
            variant='secondary'
            type='submit'>
            <LoaderCircleIcon className={cn('animate-spin', 'hidden', (isSubmitting || isPending) && 'block')} />
            Check Answer
          </Button>

          <Button hidden={!isSubmitted || !isSubmitSuccessful || isPending} className='mx-auto mt-2' variant='success' onClick={nextRandomQuestion} type='button'>
            Continue
          </Button>
        </div>
      </form>
    </Form>
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
function ChoiceAnswerOption<Q extends ChoiceQuestion>({
  registerKey,
  question,
  getFeedbackEvaluation,
  isEvaluated,
  type,
}: {
  isEvaluated: boolean
  type: Required<HTMLProps<HTMLInputElement>['type']>
  registerKey: (index: number) => Parameters<UseFormRegister<QuestionInput>>['0']
  question: Q
  getFeedbackEvaluation: ReturnType<typeof usePracticeFeeback>
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<QuestionInput>()
  const [openFeedbacks, setOpenFeedbacks] = useState<ChoiceQuestion['answers'][number]['id'][]>([])

  return question.answers.map((a, i) => {
    const { isCorrectlySelected, isFalslySelected, isMissingSelection, reasoning } = getFeedbackEvaluation(question as SingleChoice)

    return (
      <DisplayFeedbackText disabled={!isEvaluated} open={openFeedbacks.includes(a.id) ? true : undefined} feedback={reasoning?.at(i)} side={i % 2 === 1 ? 'right' : 'left'} key={a.id}>
        <label
          onClick={isEvaluated ? () => setOpenFeedbacks((prev) => (prev.includes(a.id) ? prev.filter((id) => id !== a.id) : prev.concat([a.id]))) : undefined}
          className={cn(
            'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
            'has-enabled:hover:cursor-pointer has-enabled:hover:ring-ring-hover has-enabled:dark:hover:ring-ring-hover',
            'has-enabled:focus:ring-[1.2px] has-enabled:focus:ring-ring-focus has-enabled:dark:focus:ring-ring-focus',
            'flex items-center justify-center',
            'resize-none select-none',
            'has-enabled:has-checked:bg-neutral-200/60 has-enabled:has-checked:font-semibold has-enabled:has-checked:ring-[1.5px] has-enabled:has-checked:ring-ring-hover dark:has-enabled:has-checked:bg-neutral-700/60 dark:has-enabled:has-checked:ring-neutral-300',

            isEvaluated && 'relative ring-2',
            isEvaluated &&
              isCorrectlySelected(a) &&
              'bg-radial from-neutral-200/60 via-neutral-100/60 to-green-600/20 font-semibold ring-green-400/70 dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-green-500/20 dark:ring-green-500/70',
            isEvaluated &&
              isFalslySelected(a) &&
              'cursor-help from-neutral-200/60 via-neutral-100/60 to-red-500/20 ring-red-500/70 has-checked:bg-radial has-checked:font-semibold dark:from-neutral-700/60 dark:via-neutral-700/60 dark:to-red-400/20 dark:ring-red-400/70',
            isEvaluated && isMissingSelection(a) && 'cursor-help ring-0 outline-2 outline-yellow-500 outline-dashed dark:outline-yellow-400/60',
          )}
          htmlFor={a.id}>
          {a.answer}

          <FeedbackIndicators correctlySelected={isCorrectlySelected(a)} missingSelection={isMissingSelection(a)} falslySelected={isFalslySelected(a)} />

          <input
            className='hidden'
            id={a.id}
            type={type}
            {...register(registerKey(i))}
            disabled={isEvaluated}
            value={a.id}
            data-evaluation-result={isEvaluated ? (isCorrectlySelected(a) ? 'correct' : isFalslySelected(a) ? 'incorrect' : isMissingSelection(a) ? 'missing' : 'none') : 'none'}
          />

          <FormFieldError field={registerKey(i)} errors={errors} />
        </label>
      </DisplayFeedbackText>
    )
  })
}
