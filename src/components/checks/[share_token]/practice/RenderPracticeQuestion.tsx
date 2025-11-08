'use client'

import { useActionState, useEffect, useTransition } from 'react'
import React, { HTMLProps } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, Variants } from 'framer-motion'
import { isEmpty } from 'lodash'
import { LoaderCircleIcon } from 'lucide-react'
import { CheckIcon, XIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { z } from 'zod'
import DragDropAnswers from '@/src/components/checks/[share_token]/practice/DragDropAnswerOptions'
import { OpenQuestion } from '@/src/components/checks/[share_token]/practice/OpenQuestion'
import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { usePracticeFeeback } from '@/src/hooks/checks/[share_token]/practice/usePracticeFeedback'
import { EvaluateAnswer } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { cn } from '@/src/lib/Shared/utils'
import { PracticeData, PracticeSchema } from '@/src/schemas/practice/PracticeSchema'
import { ChoiceQuestion, Question, SingleChoice } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

export function RenderPracticeQuestion() {
  const { questions, currentQuestionIndex, navigateToQuestion } = usePracticeStore((store) => store)

  const nextRandomQuestion = () => navigateToQuestion((currentQuestionIndex + 1) % questions.length)

  const question = questions.at(currentQuestionIndex)

  if (!question) notFound()

  const [state, formAction] = useActionState(EvaluateAnswer, { success: false })
  const [isPending, start] = useTransition()

  const {
    register,
    reset,
    handleSubmit,
    setError,
    setValue,
    trigger,
    watch,
    formState: { isSubmitting, isValid, isSubmitted, isSubmitSuccessful, errors },
  } = useForm({
    resolver: zodResolver<PracticeData>(PracticeSchema),
    defaultValues: {
      question_id: state.values?.question_id ?? question.id,
      type: state.values?.type ?? question.type,
    },
  })

  const getFeedbackEvaluation = usePracticeFeeback(state, { isSubmitSuccessful, isPending, isSubmitted, isSubmitting })
  const isEvaluated = isSubmitted && isSubmitSuccessful && (!isSubmitting || !isPending) && !isPending

  //* Apply server-side validation errors (if any) - so that they show up in the form
  useEffect(() => {
    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([key, msgs]) => {
        if (msgs?.length) {
          setError(key as keyof PracticeData, { type: 'server', message: msgs[0] })
        }
      })
    }

    if (state.rootError) {
      setError('root', { type: 'server', message: state.rootError })
    }
  }, [state.fieldErrors, state.rootError, setError])

  //* Handle reseting form inputs when question changes
  useEffect(() => {
    if (watch('type') === question.type && watch('question_id') === question.id) return
    else {
      //* When the question is changed reset the form (and set the new question id and type)
      reset({ question_id: question.id, type: question.type as Any })
      return
    }
  }, [question.id, question.type])

  const onSubmit = (_data: z.infer<typeof PracticeSchema>, e?: React.BaseSyntheticEvent) => {
    console.log('Submitting practice answer...', _data, e)
    start(() => {
      formAction(_data)
    })
  }

  useEffect(() => {
    const sub = watch((values, { name }) => {
      console.log(`[${name ?? 'Form-State (validation)'}] changed`, values)
    })

    return () => sub.unsubscribe()
  })

  if (!isEmpty(errors)) console.log('error', errors)
  if (isSubmitted && isSubmitSuccessful && !isPending) {
    console.log('Question has been answered...')

    console.log(state)
  }

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='my-8 flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-4'>
          <div className='flex size-6 items-center justify-center rounded-full p-1.5 text-sm font-semibold ring-1 ring-neutral-200'>{currentQuestionIndex + 1}</div>
          <h2 className='text-2xl font-semibold'>{question.question}</h2>
        </div>
        <span className='text-neutral-300'>{getQuestionActionDescriptor(question.type)}</span>
      </div>

      <div className={cn('grid min-h-[35vh] min-w-[25vw] grid-cols-2 gap-8 rounded-md p-6 ring-1 ring-neutral-500', question?.type === 'open-question' && 'grid-cols-1')}>
        {question.type === 'multiple-choice' && (
          <ChoiceAnswerOption
            type='checkbox'
            registerKey={(i) => `selection.${i}`}
            errors={errors}
            question={question}
            getFeedbackEvaluation={getFeedbackEvaluation}
            isEvaluated={isEvaluated}
            register={register}
          />
        )}

        {question.type === 'single-choice' && (
          <ChoiceAnswerOption
            type='radio'
            registerKey={() => 'selection'}
            errors={errors}
            question={question}
            getFeedbackEvaluation={getFeedbackEvaluation}
            isEvaluated={isEvaluated}
            register={register}
          />
        )}

        {question.type === 'drag-drop' && <DragDropAnswers question={question} isEvaluated={isEvaluated} state={state} setValue={setValue} trigger={trigger} />}

        {question.type === 'open-question' && (
          <OpenQuestion isEvaluated={isEvaluated} getFeedbackEvaluation={getFeedbackEvaluation} question={question} register={register} disabled={isSubmitted && isSubmitSuccessful && !isPending} />
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
          className='mx-auto mt-2 dark:bg-neutral-700'
          variant='secondary'
          type='submit'>
          <LoaderCircleIcon className={cn('animate-spin', 'hidden', (isSubmitting || isPending) && 'block')} />
          Check Answer
        </Button>

        <Button hidden={!isSubmitted || !isSubmitSuccessful || isPending} className='mx-auto mt-2 dark:bg-green-800' variant='secondary' onClick={nextRandomQuestion} type='button'>
          Continue
        </Button>
      </div>
    </form>
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
        <div className='size-3 bg-green-400/70' />
        <div className='text-green-400/70' children='Correctly answered' />
      </div>
      <div className='flex items-center gap-2'>
        <div className='size-3 bg-yellow-400/70' />
        <div className='text-yellow-400/70' children='Correct (missing)' />
      </div>
      <div className='col-span-2 flex items-center justify-center gap-2'>
        <div className='size-3 bg-red-400/70' />
        <div className='text-red-400/70' children='Wrong answer' />
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
      <CheckIcon className={cn('absolute top-1 right-1 hidden size-5 text-green-500', correctlySelected && 'block')} />
      <XIcon className={cn('absolute top-1 right-1 hidden size-5 text-red-500', falslySelected && 'block')} />
      <CheckIcon className={cn('absolute top-1 right-1 hidden size-5 text-yellow-500/80', missingSelection && 'block')} />
    </>
  )
}

/**
 * This component renders the answer-options for ChoiceQuestions as they are almost identical, to reduce code duplication
 */
function ChoiceAnswerOption<Q extends ChoiceQuestion>({
  register,
  registerKey,
  question,
  getFeedbackEvaluation,
  errors,
  isEvaluated,
  type,
}: {
  isEvaluated: boolean
  register: UseFormRegister<PracticeData>
  errors: FieldErrors<PracticeData>
  type: Required<HTMLProps<HTMLInputElement>['type']>
  registerKey: (index: number) => Parameters<UseFormRegister<PracticeData>>['0']
  question: Q
  getFeedbackEvaluation: ReturnType<typeof usePracticeFeeback>
}) {
  return question.answers.map((a, i) => {
    const { isCorrectlySelected, isFalslySelected, isMissingSelection, reasoning } = getFeedbackEvaluation(question as SingleChoice)

    return (
      <label
        key={a.id}
        className={cn(
          'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
          'has-enabled:hover:cursor-pointer has-enabled:hover:ring-neutral-500 has-enabled:dark:hover:ring-neutral-300/60',
          'has-enabled:focus:ring-[1.2px] has-enabled:focus:ring-neutral-700 has-enabled:dark:focus:ring-neutral-300/80',
          'flex items-center justify-center',
          'resize-none select-none',
          'has-enabled:has-checked:font-semibold has-enabled:has-checked:ring-[1.5px] has-enabled:dark:has-checked:bg-neutral-700/60 has-enabled:dark:has-checked:ring-neutral-300',

          isEvaluated && 'relative ring-2',
          isCorrectlySelected(a) && 'bg-radial from-neutral-700/60 via-neutral-700/60 to-green-500/20 font-semibold dark:ring-green-500/70',
          isFalslySelected(a) && 'cursor-help from-neutral-700/60 via-neutral-700/60 to-red-400/20 has-checked:bg-radial has-checked:font-semibold dark:ring-red-400/70',
          isMissingSelection(a) && 'cursor-help from-neutral-700/60 via-neutral-700/60 to-yellow-400/20 ring-0 outline-2 outline-yellow-400/60 outline-dashed dark:ring-yellow-400/60',
        )}
        title={isCorrectlySelected(a) ? undefined : isFalslySelected(a) ? reasoning?.at(i) : isMissingSelection(a) ? reasoning?.at(i) : undefined}
        htmlFor={a.id}>
        {a.answer}

        <FeedbackIndicators correctlySelected={isCorrectlySelected(a)} missingSelection={isMissingSelection(a)} falslySelected={isFalslySelected(a)} />

        <input className='hidden' id={a.id} type={type} {...register(registerKey(i))} disabled={isEvaluated} value={a.id} />

        <FormFieldError field={registerKey(i)} errors={errors} />
      </label>
    )
  })
}
