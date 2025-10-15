'use client'

import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'
import { DragDropItemPositionCounter } from '@/src/components/Shared/drag-drop/DragDropPositionCounter'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { EvaluateAnswer } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { cn } from '@/src/lib/Shared/utils'
import { PracticeData, PracticeSchema } from '@/src/schemas/practice/PracticeSchema'
import { Question } from '@/src/schemas/QuestionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash'
import { LoaderCircleIcon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { useActionState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
    formState: { isSubmitting, isValid, isSubmitted, isSubmitSuccessful, errors },
    getValues,
  } = useForm({
    resolver: zodResolver<PracticeData>(PracticeSchema),
    defaultValues: {
      question_id: state.values?.question_id ?? question.id,
      answer: {
        type: state.values?.answer?.type ?? question.type,
      },
    },
  })

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

  useEffect(() => {
    reset()
    setValue('answer.type', question.type)
  }, [question.id])

  const onSubmit = (_data: z.infer<typeof PracticeSchema>, e?: React.BaseSyntheticEvent) => {
    console.log('Submitting practice answer...', _data, e)
    start(() => {
      formAction(_data)
    })
  }

  console.log(getValues())
  if (!isEmpty(errors)) console.log('error', errors)

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='my-8 flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-4'>
          <div className='flex size-6 items-center justify-center rounded-full p-1.5 text-sm font-semibold ring-1 ring-neutral-200'>{currentQuestionIndex + 1}</div>
          <h2 className='text-2xl font-semibold'>What colors are part of france&apos;s flag?</h2>
        </div>
        <span className='text-neutral-300'>{getQuestionActionDescriptor(question.type)}</span>
      </div>

      <div className={cn('grid min-h-[35vh] min-w-[25vw] grid-cols-2 gap-8 rounded-md p-6 ring-1 ring-neutral-500', question?.type === 'open-question' && 'grid-cols-1')}>
        {question.type === 'multiple-choice' &&
          question.answers.map((a, i) => (
            <label
              key={`${question.id}-answer-${i}`}
              className={cn(
                'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
                'hover:cursor-pointer hover:ring-neutral-500 dark:hover:ring-neutral-300/60',
                'focus:ring-[1.2px] focus:ring-neutral-700 dark:focus:ring-neutral-300/80',
                'flex items-center justify-center',
                'resize-none select-none',
                'has-checked:ring-[1.5px] dark:has-checked:bg-neutral-700/60 dark:has-checked:ring-neutral-300',
              )}
              htmlFor={`${question.id}-answer-${i}`}>
              {a.answer}
              <input
                className='hidden'
                id={`${question.id}-answer-${i}`}
                type='checkbox'
                {...register(`answer.selection.${i}`)}
                disabled={isSubmitted && isSubmitSuccessful && !isPending}
                value={a.answer}
              />
            </label>
          ))}

        {question.type === 'single-choice' &&
          question.answers.map((a, i) => (
            <label
              key={`${question.id}-answer-${i}`}
              className={cn(
                'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
                'hover:cursor-pointer hover:ring-neutral-500 dark:hover:ring-neutral-300/60',
                'focus:ring-[1.2px] focus:ring-neutral-700 dark:focus:ring-neutral-300/80',
                'flex items-center justify-center',
                'resize-none select-none',
                'has-checked:ring-[1.5px] dark:has-checked:bg-neutral-700/60 dark:has-checked:ring-neutral-300',
              )}
              htmlFor={`${question.id}-answer-${i}`}>
              {a.answer}

              <input className='hidden' id={`${question.id}-answer-${i}`} type='radio' {...register('answer.selection')} disabled={isSubmitted && isSubmitSuccessful && !isPending} value={a.answer} />

              {/* @ts-expect-error: The FormFieldError component does not yet recognize deeply-nested schema-properties, e.g. arrays*/}
              <FormFieldError field='answer.selection' errors={errors} />
              <FormFieldError field='answer' errors={errors} />
            </label>
          ))}

        {question.type === 'drag-drop' && (
          <DragDropContainer
            key={question.id + question.type + (isSubmitted && isSubmitSuccessful && !isPending).toString()}
            className='col-span-2 my-auto space-y-6'
            enabled={!(isSubmitted && isSubmitSuccessful && !isPending)}
            onSwapEnd={(e) => {
              e.slotItemMap.asArray.map((el, i) => setValue(`answer.input.${i}` as const, el.item))
              trigger('answer.input')
            }}>
            {state.values?.answer?.type === 'drag-drop' && state.values?.answer.input?.length === question.answers.length
              ? //* Displays the answers from the submitted data, because `question.answers` was not modified and the component was re-rendered after submission, to not loose order
                state.values.answer.input.map((ans, i) => (
                  <DragDropItem key={ans} name={ans}>
                    <DragDropItemPositionCounter initialIndex={i} />
                    {ans}
                  </DragDropItem>
                ))
              : question.answers.map((a, i) => (
                  <DragDropItem key={a.answer} name={a.answer}>
                    <DragDropItemPositionCounter initialIndex={i} />
                    {a.answer}
                  </DragDropItem>
                ))}
          </DragDropContainer>
        )}

        {question.type === 'open-question' && (
          <textarea
            {...register('answer.input')}
            disabled={isSubmitted && isSubmitSuccessful && !isPending}
            className={cn(
              'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
              'resize-none',
              'my-auto h-full',
            )}
          />
        )}
      </div>

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
