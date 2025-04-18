import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import FieldError from '@/src/components/Shared/form/FormFieldError'
import Input from '@/src/components/Shared/form/Input'
import { default as CreateableSelect, default as Select } from '@/src/components/Shared/form/Select'
import { ChoiceQuestion, OpenQuestion, Question, QuestionSchema } from '@/src/schemas/QuestionSchema'
import { Tooltip } from '@heroui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Plus, Trash2, X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'
import { FormState, useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { v4 as uuid } from 'uuid'
export default function CreateQuestionDialog({ children, open, setOpen }: { children: ReactNode; open: boolean; setOpen: (state: boolean) => void }) {
  const { addQuestion, questionCategories } = useCreateCheckStore((state) => state)
  const closeDialog = () => setOpen(false)

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
      category: 'general',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  const resetForm = () => {
    resetInputs()
    if (fields.length > 1) {
      // remove(fields.slice(1, fields.length).map((_, i) => i + 1))
      remove(Array.from({ length: fields.length }, (_, i) => i))
      append({ answer: 'Answer A', correct: true })
      append({ answer: 'Answer B', correct: false })
      append({ answer: 'Answer C', correct: false })
      append({ answer: 'Answer D', correct: false })
    }
  }

  const onSubmitV2 = (data: Question) => {
    console.log(JSON.stringify(data, null, 2))
    addQuestion(data)
    closeDialog()
    resetForm()
  }

  useEffect(() => {
    if (!open) {
      clearErrors()
    }
  }, [open])

  const label_classes = 'dark:text-neutral-300 font-semibold tracking-tight'

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent
        onClose={closeDialog}
        onPointerDownOutside={closeDialog}
        onEscapeKeyDown={() => {
          closeDialog()
          resetForm()
        }}
        className='max-w-md dark:border-neutral-600 dark:bg-neutral-800'
        id='question-dialog'>
        <form onSubmit={handleSubmit(onSubmitV2)} className='grid gap-6 py-1'>
          <DialogHeader className='border-b pb-3 text-left dark:border-b-neutral-500/80'>
            <DialogTitle>Create Question</DialogTitle>
            <DialogDescription>Create your new question for your KnowledgeCheck</DialogDescription>
          </DialogHeader>
          <input {...register('id')} id='id' value={uuid()} className='hidden' />

          <div className='grid items-center gap-2'>
            <label htmlFor='question' className={twMerge(label_classes)}>
              Question
            </label>
            <Input {...register('question')} id='question' placeholder='Formulate your question here' className='-ml-0.5 placeholder:text-[15px]' />
            <FieldError field='question' errors={errors} />
          </div>
          <div className='grid grid-cols-2 items-baseline gap-12'>
            <div className='grid items-center gap-2'>
              <label htmlFor='points' className={twMerge(label_classes)}>
                Points
              </label>
              <Input
                {...register('points', {
                  setValueAs: (value: string) => Number(value),
                })}
                id='points'
                type='number'
                placeholder='How many points is this question worth?'
                className='-ml-0.5 placeholder:text-[15px]'
              />
              <FieldError field='points' className='whitespace-nowrap' errors={errors} />
            </div>
            <div className='grid items-center gap-2'>
              <label htmlFor='type' className={twMerge(label_classes)}>
                Question Type
              </label>
              <CreateableSelect
                name='type'
                defaultValue={{ label: watch('type').split('-').join(' '), value: watch('type') }}
                onChange={(type) => register('type').onChange({ target: { value: type, name: 'type' } })}
                options={[
                  { label: 'Single Choice', value: 'single-choice' },
                  { label: 'Multiple Choice', value: 'multiple-choice' },
                  { label: 'Open Question', value: 'open-question' },
                  { label: 'Drag Drop', value: 'drag-drop' },
                ]}
              />
              <FieldError field='type' errors={errors} />
            </div>
          </div>
          <div className='grid items-center gap-2'>
            <label htmlFor='category' className={twMerge(label_classes)}>
              Category
            </label>
            <Select
              selectTriggerClassname='-ml-0.5'
              popoverContentClassname='w-[470px]'
              onChange={(category) => register('category').onChange({ target: { value: category, name: 'category' } })}
              options={[...questionCategories.map((cat) => ({ label: cat.name, value: cat.name }))]}
              createable
              defaultValue={{ label: watch('category'), value: watch('category') }}
            />
            <FieldError field='category' errors={errors} />
          </div>
          <div className='grid items-center gap-2' id='question-answers'>
            <label htmlFor='answers' className={twMerge(label_classes)}>
              Answers
            </label>

            <AnswerOptions control={control} watch={watch} register={register} errors={errors} />
          </div>
          <DialogFooter className='mt-4 grid grid-cols-2 gap-4'>
            <button onClick={() => setOpen(false)} className='rounded-md px-4 py-2 ring-2 hover:cursor-pointer dark:ring-neutral-400/30' type='button'>
              Cancel
            </button>
            <button className='rounded-md px-4 py-2 ring-2 hover:cursor-pointer dark:bg-neutral-700 dark:ring-neutral-500/60' type='submit'>
              {isSubmitting ? 'Loading' : 'Add'}
            </button>
            {errors.root && <div>{JSON.stringify(errors.root)}</div>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface AnswerOptionProps extends Pick<UseFormReturn<Question>, 'control' | 'watch' | 'register'> {
  errors: FormState<Question>['errors']
}

function AnswerOptions(options: AnswerOptionProps) {
  switch (options.watch('type') as Question['type']) {
    case 'multiple-choice':
      return <ChoiceQuestionAnswers {...options} />

    case 'single-choice':
      return <ChoiceQuestionAnswers {...options} />

    case 'open-question':
      return <OpenQuestionAnswers {...options} />

    default:
      return <>Not yet implemented</>
  }
}

function ChoiceQuestionAnswers({ control, watch, register, errors }: AnswerOptionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  return (
    <>
      <div className='grid gap-4'>
        {fields.map((field, index) => (
          <div key={field.id} className='grid gap-2'>
            <div className='flex items-center gap-3'>
              <Tooltip
                showArrow={true}
                shouldFlip={true}
                closeDelay={0}
                delay={500}
                color='primary'
                content={`Answer marked as ${watch(`answers.${index}.correct` as const) ? 'correct' : 'wrong'}`}
                offset={-10}
                className='rounded-md p-1 text-xs ring-[0.5px] dark:bg-neutral-700 dark:ring-neutral-700'>
                <label className='flex size-6 items-center rounded-full p-1 ring-1 hover:cursor-pointer dark:ring-neutral-500'>
                  <Check className={twMerge('size-5 dark:text-green-500', !(watch(`answers.${index}`) as unknown as ChoiceQuestion['answers'][number]).correct && 'hidden')} />
                  <X className={twMerge('size-5 dark:text-red-400/80', (watch(`answers.${index}`) as unknown as ChoiceQuestion['answers'][number]).correct && 'hidden')} />
                  <input type='checkbox' {...register(`answers.${index}.correct` as const)} title='Mark as correct' className='appearance-none' />
                </label>
              </Tooltip>
              <Input {...register(`answers.${index}.answer` as const)} placeholder={`Answer ${index + 1}`} className='-ml-0.5 flex-1 placeholder:text-[15px]' />
              <button aria-label='delete answer' type='button' onClick={() => remove(index)} className='flex cursor-pointer items-center gap-1 rounded-md py-1 dark:text-neutral-300/60'>
                <Trash2 className='size-5 dark:text-red-400/60' />
              </button>
            </div>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <FieldError<any> field={`answers.${index}.answer`} errors={errors} />
          </div>
        ))}
      </div>

      <FieldError<ChoiceQuestion> field='answers' errors={errors} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FieldError<any> field='answers.root' errors={errors} />

      <button
        type='button'
        aria-label='Add Answer'
        onClick={() => append({ answer: '', correct: false })}
        className='flex max-w-fit items-center gap-1 rounded-md py-1 hover:cursor-pointer dark:text-neutral-300/60'>
        <Plus className='size-4' />
        Add Answer
      </button>
    </>
  )
}

function OpenQuestionAnswers({ register, errors }: AnswerOptionProps) {
  return (
    <>
      <Input {...register('expectation')} id='expectation' placeholder='What answer are you looking expecting' className='-ml-0.5 placeholder:text-[15px]' />
      <FieldError<OpenQuestion> field='expectation' errors={errors} />
    </>
  )
}
