'use client'

import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import Card from '@/components/Shared/Card'
import { cn } from '@/lib/Shared/utils'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Input from '@/src/components/Shared/form/Input'
import { ChoiceQuestion, OpenQuestion, Question, QuestionSchema } from '@/src/schemas/QuestionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, Plus, Trash2 } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'

export default function QuestionsSection() {
  const { questions } = useCreateCheckStore((state) => state)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card disableHoverStyles className='break-inside-avoid'>
      <div className='header -m-3 mb-0 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>Questions</h2>
        </div>
      </div>
      <div className='questions'>
        <div className={cn('my-20 flex flex-col items-center justify-center gap-6', questions.length > 0 && 'hidden')}>
          <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
          <span className='tracking-wide text-neutral-500 dark:text-neutral-400'>Currently there are no questions associated to this quiz</span>
        </div>
        <div className={cn('my-4 grid grid-cols-1 gap-6')}>
          {questions.map((question, i) => (
            <div key={i + question.id}>
              <Card className='question flex gap-3 p-2 hover:bg-none'>
                <div className='header flex flex-1 flex-col p-1'>
                  <div className='flex items-center justify-between'>
                    <h2 className=''>{question.question || `Question ${i + 1}`}</h2>
                    <span className='dark:text-neutral-200'>
                      {question.points} point{question.points > 1 && 's'}
                    </span>
                  </div>
                  <div className='flex justify-between text-xs'>
                    <div className='flex items-center gap-1 text-neutral-400 dark:text-neutral-400'>
                      <span className='lowercase'>{question.category}</span>
                    </div>
                    <span className='text-neutral-400 dark:text-neutral-400'>{question.type}</span>
                  </div>
                </div>
                {/* <CreateQuestionDialog open={dialogOpen} setOpen={setDialogOpen}>
                  <div className='my-auto flex max-h-10 items-center gap-4 rounded-md p-3 hover:cursor-pointer dark:bg-neutral-600/70'>
                    <Pen className='size-4 dark:text-orange-400/70' />
                  </div>
                </CreateQuestionDialog> */}
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center gap-8'>
        <CreateQuestionDialog open={dialogOpen} setOpen={setDialogOpen}>
          <div className='mx-4 flex w-72 items-center justify-center gap-2 rounded-md border-2 border-dashed border-blue-500/70 p-3 tracking-wider hover:cursor-pointer dark:border-neutral-300/70 dark:text-neutral-300 dark:hover:bg-neutral-500/30'>
            <Plus className='size-5' />
            Create Question
          </div>
        </CreateQuestionDialog>
      </div>
    </Card>
  )
}

function CreateQuestionDialog({ children, open, setOpen }: { children: ReactNode; open: boolean; setOpen: (state: boolean) => void }) {
  const { addQuestion } = useCreateCheckStore((state) => state)
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    reset: resetInputs,
    watch,
    control,
  } = useForm<Question>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      points: 1,
      type: 'multiple-choice',
      answers: [
        { answer: 'Answer A', correct: true },
        { answer: 'Answer B', correct: false },
        { answer: 'Answer C', correct: false },
        { answer: 'Answer D', correct: false },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  const FieldError = <Type extends Question>({ field }: { field: keyof FieldErrors<Type> }) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if (Object.keys(errors).length === 0) return null

    let error: { message?: string } | undefined = errors as any

    const fields = field.toString().split('.')

    for (const field of fields) {
      if (!error) continue

      error = (error as any)[field]
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return error?.message ? <div className='text-[15px] text-red-400 dark:text-red-400/80'>{error.message}</div> : null
  }

  const resetForm = () => {
    resetInputs()
    if (fields.length > 1) {
      remove(fields.slice(1, fields.length).map((_, i) => i + 1))
    }
  }

  const onSubmitV2 = (data: Question) => {
    console.log(JSON.stringify(data, null, 2))
    addQuestion(data)
    setOpen(false)
    resetForm()
  }

  useEffect(() => {
    if (!open) {
      clearErrors()
    }
  }, [open])

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={() => {
          setOpen(false)
          resetForm()
        }}
        className='max-w-md dark:border-neutral-600 dark:bg-neutral-800'
        id='question-dialog'>
        <form onSubmit={handleSubmit(onSubmitV2)} className='grid gap-6 py-1'>
          <DialogHeader className='border-b pb-3 text-left dark:border-b-neutral-500/80'>
            <DialogTitle>Create Question</DialogTitle>
            <DialogDescription>Create your new question for your KnowledgeCheck</DialogDescription>
          </DialogHeader>
          <input {...register('id')} id='id' value={crypto.randomUUID()} className='hidden' />

          <div className='grid items-center gap-2'>
            <label htmlFor='question' className='dark:text-neutral-300/90'>
              Question
            </label>
            <Input {...register('question')} id='question' placeholder='Formulate your question here' className='-ml-0.5 placeholder:text-[15px]' />
            <FieldError field='question' />
          </div>
          <div className='grid grid-cols-2 items-baseline gap-12'>
            <div className='grid items-center gap-2'>
              <label htmlFor='points' className='dark:text-neutral-300/90'>
                Points
              </label>
              <Input
                {...register('points', {
                  setValueAs: (value: string) => Number(value),
                })}
                id='points'
                type='number'
                placeholder='How many points is this question worth?'
                min={1}
                className='-ml-0.5 placeholder:text-[15px]'
              />
              <FieldError field='points' />
            </div>
            <div className='grid items-center gap-2'>
              <label htmlFor='type' className='dark:text-neutral-300/90'>
                Question Type
              </label>
              <Input {...register('type')} id='type' placeholder='choice, open-question, ....' min={1} className='-ml-0.5 placeholder:text-[15px]' />
              <FieldError field='type' />
            </div>
          </div>
          <div className='grid items-center gap-2'>
            <label htmlFor='category' className='dark:text-neutral-300/90'>
              Category
            </label>
            <Input {...register('category')} id='category' type='select' placeholder='What category does this question belong to?' defaultValue='general' className='-ml-0.5 placeholder:text-[15px]' />
            <FieldError field='category' />
          </div>
          <div className='grid items-center gap-2'>
            <label htmlFor='answers' className='dark:text-neutral-300/90'>
              Answers
            </label>

            {(watch('type') === 'single-choice' || watch('type') === 'multiple-choice') && (
              <>
                <div className='grid gap-4'>
                  {fields.map((field, index) => (
                    <div key={field.id} className='flex items-center gap-2'>
                      <Input {...register(`answers.${index}.answer` as const)} placeholder={`Answer ${index + 1}`} className='-ml-0.5 flex-1 placeholder:text-[15px]' />
                      <input type='checkbox' {...register(`answers.${index}.correct` as const)} title='Mark as correct' />
                      <button type='button' onClick={() => remove(index)} className='flex items-center gap-1 rounded-md py-1 dark:text-neutral-300/60'>
                        <Trash2 className='size-5 dark:text-red-400/60' />
                      </button>
                    </div>
                  ))}
                </div>

                <FieldError<ChoiceQuestion> field='answers' />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <FieldError<any> field='answers.root' />

                <button type='button' onClick={() => append({ answer: '', correct: false })} className='flex max-w-fit items-center gap-1 rounded-md py-1 dark:text-neutral-300/60'>
                  <Plus className='size-4' />
                  Add Answer
                </button>
              </>
            )}

            {watch('type') === 'open-question' && (
              <>
                <Input {...register('expectation')} id='expectation' placeholder='What answer are you looking expecting' className='-ml-0.5 placeholder:text-[15px]' />
                <FieldError<OpenQuestion> field='expectation' />
              </>
            )}
          </div>
          <DialogFooter className='mt-4 grid grid-cols-2 gap-4'>
            <button onClick={() => setOpen(false)} className='rounded-md px-4 py-2 ring-2 hover:cursor-pointer dark:ring-red-400/30' type='button'>
              Cancel
            </button>
            <button className='dark:from:bg-blue-500/25 rounded-md bg-gradient-to-b from-blue-500/15 to-blue-700/20 px-4 py-2 ring-2 hover:cursor-pointer dark:ring-blue-400/30' type='submit'>
              {isSubmitting ? 'Loading' : 'Add'}
            </button>
            {errors.root && <div>{JSON.stringify(errors.root)}</div>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
