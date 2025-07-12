import { useCreateCheckStore } from '@/components/check/create/CreateCheckProvider'
import { Button } from '@/src/components/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import FieldError from '@/src/components/Shared/form/FormFieldError'
import Input from '@/src/components/Shared/form/Input'
import { default as CreateableSelect, default as Select } from '@/src/components/Shared/form/Select'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { ChoiceQuestion, OpenQuestion, Question, QuestionSchema } from '@/src/schemas/QuestionSchema'
import { Tooltip } from '@heroui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDown, ArrowUp, Check, Plus, Trash2, X } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { FormState, useFieldArray, UseFieldArrayReturn, useForm, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
export default function CreateQuestionDialog({ children, initialValues }: { children: ReactNode; initialValues?: Partial<Question> }) {
  const [dialogOpenState, setDialogOpenState] = useState<boolean>(false)
  const { addQuestion, questionCategories } = useCreateCheckStore((state) => state)

  const getDefaultValues = (type: Question['type']): Partial<Question> => {
    const baseValues: Partial<Pick<Question, 'category' | 'id' | 'points' | 'question'>> = {
      points: 1,
      category: 'general',
    }

    switch (type) {
      case 'multiple-choice':
        return {
          ...baseValues,
          // question: 'Which of the following is a programming language?',
          type,
          answers: [
            { answer: 'Python', correct: true },
            { answer: 'ASCII', correct: false },
            { answer: 'ByteCode', correct: false },
            { answer: 'JavaScript', correct: true },
          ],
        }
      case 'single-choice':
        return {
          ...baseValues,
          // question: 'What does RGB stand for?',
          type,
          answers: [
            { answer: 'Red, Green, Blue', correct: true },
            { answer: 'Red, Green, Black', correct: false },
            { answer: 'Red, Green, Yellow', correct: false },
            { answer: 'Red, Green, White', correct: false },
          ],
        }

      case 'open-question':
        return {
          ...baseValues,
          // question: 'Describe the essential parts of a computer.',
          type,
          expectation: 'A computer consists of hardware and software components that work together to perform tasks. This includes components like the CPU, memory, storage, and input/output devices.',
        }

      case 'drag-drop':
        return {
          ...baseValues,
          // question: 'Move these activities based the order in which they should be performed',
          type,
          answers: [
            { answer: 'Prepare the workspace', position: 1 },
            { answer: 'Gather materials', position: 2 },
            { answer: 'Follow the instructions', position: 3 },
            { answer: 'Clean up', position: 4 },
          ],
        }

      default:
        return {}
    }
  }

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    reset: resetInputs,
    watch,
    control,
    setValue,
  } = useForm<Question>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: initialValues || getDefaultValues('drag-drop'),
  })

  const closeDialog = ({ reset = false }: { reset?: boolean } = {}) => {
    setDialogOpenState(false)
    if (reset) {
      resetInputs()
    }
  }

  useEffect(() => {
    const type = watch('type')
    if (type) {
      resetInputs({ ...getDefaultValues(type), question: watch('question'), points: watch('points'), category: watch('category') })
    }
  }, [watch('type')])

  const onSubmit = (data: Question) => {
    console.log(JSON.stringify(data, null, 2))
    addQuestion(data)
    closeDialog({ reset: true })
  }

  useEffect(() => {
    if (!dialogOpenState) {
      clearErrors()
    }
  }, [dialogOpenState])

  const label_classes = 'dark:text-neutral-300 font-semibold tracking-tight'

  return (
    <Dialog open={dialogOpenState}>
      <DialogTrigger asChild onClick={() => setDialogOpenState(true)}>
        {children}
      </DialogTrigger>
      <DialogContent
        onClose={() => closeDialog()}
        onPointerDownOutside={() => closeDialog()}
        onEscapeKeyDown={() => closeDialog({ reset: true })}
        className='max-w-md dark:border-neutral-600 dark:bg-neutral-800'
        id='question-dialog'>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-1'>
          <QuestionDialogHeader type={initialValues ? 'edit' : 'create'} />
          <input {...register('id')} id='id' value={initialValues?.id || getUUID()} className='hidden' />

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

            <AnswerOptions control={control} watch={watch} register={register} errors={errors} setValue={setValue} />
          </div>
          <DialogFooter className='mt-4 grid grid-cols-2 gap-4'>
            <Button size='lg' variant='outline' onClick={() => setDialogOpenState(false)} type='button'>
              Cancel
            </Button>
            <Button size='lg' variant='primary' type='submit'>
              {isSubmitting ? 'Processing' : 'Add Question'}
            </Button>
            {errors.root && <div>{JSON.stringify(errors.root)}</div>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function QuestionDialogHeader({ type }: { type: 'create' | 'edit' }) {
  const title = type === 'create' ? 'Create Question' : 'Edit Question'
  const description = type === 'create' ? 'Create your new question for your KnowledgeCheck' : 'Edit your existing question of your KnowledgeCheck'

  return (
    <DialogHeader className='border-b border-b-neutral-400/80 pb-3 text-left dark:border-b-neutral-500/80'>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  )
}
interface AnswerOptionProps extends Pick<UseFormReturn<Question>, 'control' | 'watch' | 'register' | 'setValue'> {
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

    case 'drag-drop':
      return <DragDropQuestionAnswers {...options} />

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
                // offset={-10}
                className='rounded-md p-1 text-xs ring-[0.5px] dark:bg-neutral-700 dark:ring-neutral-700'>
                <label className='flex size-6 items-center rounded-full bg-neutral-100/90 p-1 ring-1 ring-neutral-400 hover:cursor-pointer dark:bg-transparent dark:ring-neutral-500'>
                  <Check className={twMerge('size-5 text-green-500 dark:text-green-500', !(watch(`answers.${index}`) as unknown as ChoiceQuestion['answers'][number]).correct && 'hidden')} />
                  <X className={twMerge('size-5 text-red-400 dark:text-red-400/80', (watch(`answers.${index}`) as unknown as ChoiceQuestion['answers'][number]).correct && 'hidden')} />
                  <input type='checkbox' {...register(`answers.${index}.correct` as const)} title='Mark as correct' className='appearance-none' />
                </label>
              </Tooltip>
              <Input {...register(`answers.${index}.answer` as const)} placeholder={`Answer ${index + 1}`} className='-ml-0.5 flex-1 placeholder:text-[15px]' />
              <DeleteAnswerOptionButton index={index} remove={remove} />
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

function DragDropQuestionAnswers({ register, errors, control, watch, setValue }: AnswerOptionProps) {
  const { fields, append, remove, move } = useFieldArray({
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
                tabIndex={-1}
                showArrow={true}
                shouldFlip={true}
                closeDelay={0}
                delay={500}
                color='primary'
                content={`The correct position for this answer`}
                // offset={-10}
                className='rounded-md p-1 text-xs ring-[0.5px] dark:bg-neutral-700 dark:ring-neutral-700'>
                <label className='group flex size-6 items-center justify-center rounded-full bg-neutral-100/90 p-1 text-sm ring-1 ring-neutral-400 hover:cursor-pointer dark:bg-transparent dark:ring-neutral-500'>
                  <input
                    tabIndex={-1}
                    type='number'
                    value={index + 1}
                    readOnly
                    disabled
                    {...register(`answers.${index}.position` as const)}
                    onChange={(e) => console.log('Value changed: ', e.target.valueAsNumber)}
                    className='hidden-spin-button field-sizing-content text-center outline-0'
                  />
                </label>
              </Tooltip>
              <Input {...register(`answers.${index}.answer` as const)} placeholder={`Answer ${index + 1}`} className='-ml-0.5 flex-1 placeholder:text-[15px]' />
              <div className='flex gap-2'>
                <button
                  aria-label='move answer up'
                  type='button'
                  onClick={() => {
                    move(index, index - 1)
                    setValue(`answers.${index}.position`, index + 1, { shouldValidate: true })
                    setValue(`answers.${index - 1}.position`, index, { shouldValidate: true })
                  }}
                  className='group flex cursor-pointer items-center gap-1 rounded-md py-1 text-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-200 dark:text-neutral-300/60 dark:disabled:text-neutral-600'
                  disabled={index - 1 < 0}>
                  <ArrowUp className='size-5 group-enabled:hover:scale-110 group-enabled:active:scale-125 dark:group-enabled:hover:text-neutral-300/80' />
                </button>
                <button
                  aria-label='move answer down'
                  type='button'
                  disabled={index + 1 >= fields.length}
                  onClick={() => {
                    move(index, index + 1)
                    setValue(`answers.${index}.position`, index + 1)
                    setValue(`answers.${index + 1}.position`, index + 2)
                  }}
                  className='group flex cursor-pointer items-center gap-1 rounded-md py-1 text-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-200 dark:text-neutral-300/60 dark:disabled:text-neutral-600'>
                  <ArrowDown className='size-5 group-enabled:hover:scale-110 group-enabled:hover:text-neutral-600/80 group-enabled:active:scale-125 dark:group-enabled:hover:text-neutral-300/80' />
                </button>
                <DeleteAnswerOptionButton index={index} remove={remove} />
              </div>
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
        onClick={() => append({ answer: '', position: watch('answers').length + 1 })}
        className='flex max-w-fit items-center gap-1 rounded-md py-1 hover:cursor-pointer dark:text-neutral-300/60'>
        <Plus className='size-4' />
        Add Answer
      </button>
    </>
  )
}

function DeleteAnswerOptionButton({ index, remove }: { index: number; remove: UseFieldArrayReturn<Question>['remove'] }) {
  return (
    <button aria-label='delete answer' type='button' onClick={() => remove(index)} className='ml-1 flex cursor-pointer items-center gap-1 rounded-md py-1 dark:text-neutral-300/60'>
      <Trash2 className='size-5 text-red-600/60 dark:text-red-400/60' />
    </button>
  )
}
