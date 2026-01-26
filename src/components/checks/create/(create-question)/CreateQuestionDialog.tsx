/* eslint-disable react-hooks/incompatible-library */
import { HTMLProps, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { TooltipProps } from '@heroui/tooltip'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { ArrowDown, ArrowUp, Check, Plus, Trash2, X } from 'lucide-react'
import { FormState, useFieldArray, UseFieldArrayReturn, useForm, useFormContext, UseFormReturn } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { useCheckStore } from '@/components/checks/create/CreateCheckProvider'
import { Button } from '@/src/components/shadcn/button'
import { Form } from '@/src/components/shadcn/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Field from '@/src/components/Shared/form/Field'
import FieldError from '@/src/components/Shared/form/FormFieldError'
import { default as CreateableSelect, default as Select } from '@/src/components/Shared/form/Select'
import Tooltip from '@/src/components/Shared/Tooltip'
import debounceFunction from '@/src/hooks/Shared/debounceFunction'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@/src/lib/Shared/utils'
import {
  ChoiceQuestion,
  DragDropQuestion,
  instantiateDragDropQuestion,
  instantiateMultipleChoice,
  instantiateOpenQuestion,
  instantiateSingleChoice,
  Question,
  QuestionSchema,
} from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'

const generateQuestionDefaults = (type: Question['type']): Partial<Question> & Pick<Question, 'id'> => {
  switch (type) {
    case 'multiple-choice':
      return {
        ...instantiateMultipleChoice({ overrideArraySize: 4 }),
        question: '',
        points: 1,
      }
    case 'single-choice':
      return {
        ...instantiateSingleChoice({ overrideArraySize: 4 }),
        question: '',
        points: 1,
      }

    case 'open-question':
      return {
        ...instantiateOpenQuestion({ overrideArraySize: 4 }),
        question: '',
        points: 1,
      }

    case 'drag-drop':
      const dragQuestion = instantiateDragDropQuestion({ overrideArraySize: 4 })
      return {
        ...dragQuestion,
        question: '',
        points: 1,

        answers: dragQuestion.answers.map((a, i) => ({ ...a, position: i })),
      }
  }
}

const DELAY_ERROR_TIME = 250

export default function CreateQuestionDialog({ children, initialValues }: { children: ReactNode; initialValues?: Partial<Question> & Pick<Question, 'id'> }) {
  const [dialogOpenState, setDialogOpenState] = useState<boolean>(false)
  const { addQuestion, questionCategories } = useCheckStore((state) => state)

  const tQuestion = useScopedI18n('Shared.Question')
  const t = useScopedI18n('Checks.Create.CreateQuestionDialog')

  const computeFormDefaults = useCallback(() => (initialValues === undefined || isEmpty(initialValues) ? generateQuestionDefaults('drag-drop') : initialValues), [initialValues])
  const mode: 'edit' | 'create' = isEmpty(initialValues) ? 'create' : 'edit'

  const form = useForm<Question>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: computeFormDefaults(),
    mode: 'onChange',
    delayError: DELAY_ERROR_TIME,
  })

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting, disabled },
    reset: resetInputs,
    watch,
    control,
    setValue,
    getValues,
  } = form

  useEffect(() => {
    if (isEqual(getValues(), initialValues) || isEmpty(initialValues)) return

    console.debug('initial value have changed, resetting form-fields...')
    resetInputs(initialValues)
  }, [initialValues])

  const closeDialog = ({ reset = false }: { reset?: boolean } = {}) => {
    setDialogOpenState(false)
    if (reset) {
      resetInputs(computeFormDefaults())
    }
  }

  const onSubmit = (data: Question) => {
    console.log(JSON.stringify(data, null, 2))
    addQuestion(data)
    closeDialog({ reset: true })

    //* needed to set new form-values (unique question-id) as default-values are only set once within the form when the useForm initializes. Thus, updating the defaultValues variable will not lead to different form-defaultValues.
    resetInputs(computeFormDefaults())
  }

  const label_classes = 'dark:text-neutral-300 font-semibold tracking-tight'

  return (
    <Dialog open={dialogOpenState} onOpenChange={(state) => (!state ? clearErrors() : null)}>
      <DialogTrigger
        asChild
        onClick={() => {
          setDialogOpenState(true)
          //* ensure that the dialog always displays data of the correct question (based on id)
          if (mode === 'edit' && watch('id') !== initialValues?.id) resetInputs(initialValues)
        }}>
        {children}
      </DialogTrigger>
      <DialogContent onClose={() => closeDialog()} onPointerDownOutside={() => closeDialog()} onEscapeKeyDown={() => closeDialog({ reset: true })} className='max-w-md' id='question-dialog'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-6 py-1'>
            <QuestionDialogHeader type={mode} />
            <input {...register('id')} id='id' value={watch('id')} className='hidden' />

            <div className='grid items-center gap-2'>
              <Field form={form} name='question' label={tQuestion('question_label')} placeholder={t('placeholders.question')} labelClassname={cn('text-base -ml-1', label_classes)} />
            </div>

            <div className={cn('flex items-baseline gap-x-10', errors.points && 'gap-x-6')}>
              <div className='grid items-center gap-2'>
                <Field
                  form={form}
                  name='points'
                  label={tQuestion('points_label')}
                  type='number'
                  onChange={({ valueAsNumber }) => valueAsNumber}
                  labelClassname={cn('text-base -ml-1', label_classes)}
                />
              </div>
              <div className='grid items-center gap-2'>
                <label htmlFor='type' className={twMerge(label_classes)}>
                  {tQuestion('type_label')}
                </label>
                <CreateableSelect
                  disabled={disabled}
                  name='type'
                  defaultValue={{ label: tQuestion(`type.${watch('type')}`), value: watch('type') }}
                  onChange={(type) => {
                    if (type !== watch('type')) {
                      let defaults = generateQuestionDefaults(type as Any)

                      if (mode === 'edit' && type === initialValues?.type && watch('type') === 'open-question') {
                        //* Fill the initival values when swapping back to initial-edit-question and the values were lost because the user swapped to e.g. an open-question in between
                        defaults = initialValues
                      } else if ((type as Question['type']) !== 'open-question' && watch('type') !== 'open-question') {
                        //* override the answer-options size to the previous size; e.g. when the prev. question had 3 answer-options and it is compatible the updated question-type will also show 3 options with the same values
                        const previous = watch('answers').length
                        if ((defaults as ChoiceQuestion | DragDropQuestion).answers.length !== previous) {
                          console.debug(
                            `Question-type changed ('${watch('type')}' --> '${type}'), overriding answer-options from previous compatible question-type from ${(defaults as ChoiceQuestion | DragDropQuestion).answers.length} to ${previous}`,
                          )
                          // @ts-expect-error potential type-mismatch the properties of (`answers.{i}`) might be of type DragDropQuestion while the defaults.answers could be of type ChoiceQuestion. Hence, it might include 'incorrect' / irrelevant props like position or correct.
                          ;(defaults as ChoiceQuestion | DragDropQuestion).answers = Array.from({ length: previous }).map((_, i) => ({
                            ...watch(`answers.${i}`),
                          }))
                        }

                        //* pre-fill answer-options based on previous-inputs when possible;  when the previous and new question-type has multiple answers
                        defaults = { ...defaults, answers: (defaults as ChoiceQuestion | DragDropQuestion).answers.map((a, i) => ({ ...a, answer: watch(`answers.${i}.answer`) })) } as
                          | ChoiceQuestion
                          | DragDropQuestion
                      }

                      resetInputs({ ...defaults, id: watch('id'), question: watch('question'), points: watch('points'), category: watch('category') })
                    }
                    register('type').onChange({ target: { value: type, name: 'type' } })
                  }}
                  options={[
                    { label: tQuestion('type.single-choice'), value: 'single-choice' },
                    { label: tQuestion('type.multiple-choice'), value: 'multiple-choice' },
                    { label: tQuestion('type.open-question'), value: 'open-question' },
                    { label: tQuestion('type.drag-drop'), value: 'drag-drop' },
                  ]}
                />
                <FieldError field='type' errors={errors} />
              </div>
              <div className='grid items-center gap-2'>
                <label htmlFor='access' className={twMerge(label_classes)}>
                  {tQuestion('accessibility_label')}
                </label>

                <Select
                  disabled={disabled}
                  selectTriggerClassname='-ml-0.5 min-w-36'
                  popoverContentClassname='w-[170px]'
                  onChange={(accessibility) => register('accessibility').onChange({ target: { value: accessibility, name: 'accessibility' } })}
                  options={[
                    { label: tQuestion('accessibility.all'), value: 'all' },
                    { label: tQuestion('accessibility.practice-only'), value: 'practice-only' },
                    { label: tQuestion('accessibility.exam-only'), value: 'exam-only' },
                  ]}
                  defaultValue={{
                    label: tQuestion(`accessibility.${watch('accessibility')}`),
                    value: watch('accessibility'),
                  }}
                />

                <FieldError field='accessibility' className='whitespace-nowrap' errors={errors} />
              </div>
            </div>
            <div className='grid items-center gap-2'>
              <label htmlFor='category' className={twMerge(label_classes)}>
                {tQuestion('category_label')}
              </label>
              <Select
                disabled={disabled}
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
                {tQuestion('answers_label')}
              </label>

              <AnswerOptions control={control} watch={watch} register={register} errors={errors} setValue={setValue} />
            </div>
            <DialogFooter className='mt-4 grid grid-cols-2 gap-4'>
              <Button size='lg' variant='outline' onClick={() => setDialogOpenState(false)} type='button'>
                {t('buttons.cancel_button_label')}
              </Button>
              <Button size='lg' variant='primary' type='submit'>
                {isSubmitting ? 'Processing' : mode === 'create' ? t('buttons.add_submit_button_label') : t('buttons.update_submit_button_label')}
              </Button>
              {errors.root && <div>{JSON.stringify(errors.root)}</div>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function QuestionDialogHeader({ type }: { type: 'create' | 'edit' }) {
  const t = useScopedI18n('Checks.Create.CreateQuestionDialog.Header')
  const title = type === 'create' ? t('title_create') : t('title_edit')
  const description = type === 'create' ? t('description_create') : t('description_edit')

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
      return <OpenQuestionAnswers />

    case 'drag-drop':
      return <DragDropQuestionAnswers {...options} />

    default:
      return <>Not yet implemented</>
  }
}

function ChoiceQuestionAnswers({ control, watch, register, errors }: AnswerOptionProps) {
  const t = useScopedI18n('Checks.Create.CreateQuestionDialog')
  const form = useFormContext<Question>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  const debounceValidation = useMemo(
    () =>
      debounceFunction(() => {
        for (let i = 0; i < fields.length; i++) {
          // revalidate fields to e.g. check for uniqueness
          form.trigger(`answers.${i}.answer` as const)
        }
      }, DELAY_ERROR_TIME),
    [form, fields],
  )

  return (
    <>
      <div className='grid gap-4'>
        {fields.map((field, index) => (
          <div key={field.id} className='grid gap-2'>
            <div className='flex items-start gap-3 [&_button]:mt-1 [&_label]:mt-1.5'>
              <CircleAnswer_IndicatorInput
                registerProps={[`answers.${index}.correct` as const]}
                inputType='checkbox'
                register={register}
                tooltipContent={watch(`answers.${index}.correct` as const) ? t('tooltips.choice_question_marked_correct') : t('tooltips.choice_question_marked_incorrect')}>
                <Check className={twMerge('size-5 text-green-500 dark:text-green-500', !(watch(`answers.${index}`) as unknown as ChoiceQuestion['answers'][number]).correct && 'hidden')} />
                <X className={twMerge('size-5 text-red-400 dark:text-red-400/80', (watch(`answers.${index}`) as unknown as ChoiceQuestion['answers'][number]).correct && 'hidden')} />
              </CircleAnswer_IndicatorInput>
              <Field
                form={form}
                name={`answers.${index}.answer` as const}
                containerClassname='flex-1'
                placeholder={t('placeholders.choice_answer_option', { position: index + 1 })}
                onKeyUp={debounceValidation}
                showLabel={false}
              />
              <DeleteAnswerOptionButton index={index} remove={remove} />
            </div>
          </div>
        ))}
      </div>

      <FieldError<ChoiceQuestion> field='answers' errors={errors} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FieldError<any> field='answers.root' errors={errors} />

      <AddAnswerButton type='choice-question' watch={watch} append={append} />
    </>
  )
}

function AddAnswerButton({ type, watch, append }: { append: UseFieldArrayReturn<Question>['append']; type: 'choice-question' | DragDropQuestion['type']; watch: UseFormReturn<Question>['watch'] }) {
  const t = useScopedI18n('Checks.Create.CreateQuestionDialog.buttons')

  const generateNewAnswer = () => {
    switch (type) {
      case 'choice-question': {
        append({ id: getUUID(), answer: '', correct: false })
        break
      }

      case 'drag-drop': {
        append({ id: getUUID(), answer: '', position: watch('answers').length })
        break
      }
    }
  }

  return (
    <button
      type='button'
      aria-label={t('add_answer_label')}
      onClick={() => generateNewAnswer()}
      className='flex max-w-fit items-center gap-1 rounded-md py-1 text-neutral-700 hover:cursor-pointer dark:text-neutral-300/60'>
      <Plus className='size-4' />
      {t('add_answer_label')}
    </button>
  )
}

function OpenQuestionAnswers() {
  const t = useScopedI18n('Checks.Create.CreateQuestionDialog.placeholders')
  const form = useFormContext()

  return <Field form={form} name='expectation' id='expectation' placeholder={t('open_question_expectation')} showLabel={false} />
}

function DragDropQuestionAnswers({ register, errors, control, watch, setValue }: AnswerOptionProps) {
  const t = useScopedI18n('Checks.Create.CreateQuestionDialog.tooltips')
  const form = useFormContext()
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'answers',
  })

  const debounceValidation = useMemo(
    () =>
      debounceFunction(() => {
        for (let i = 0; i < fields.length; i++) {
          // revalidate fields to e.g. check for uniqueness
          form.trigger(`answers.${i}.answer` as const)
        }
      }, DELAY_ERROR_TIME),
    [form, fields],
  )

  return (
    <>
      <div className='grid gap-4'>
        {fields.map((field, index) => (
          <div key={field.id} className='grid gap-2'>
            <div className='flex items-start gap-3 [&_.drag-actions]:mt-1 [&_label]:mt-1.5'>
              <CircleAnswer_IndicatorInput
                value={index}
                register={register}
                inputType='hidden'
                tooltipContent={t('drag_drop_correct_position')}
                registerProps={[`answers.${index}.position` as const, { valueAsNumber: true }]}>
                <span className='field-sizing-content text-center outline-0'>{index + 1}</span>
              </CircleAnswer_IndicatorInput>
              <Field form={form} name={`answers.${index}.answer` as const} onKeyUp={debounceValidation} containerClassname='flex-1' showLabel={false} />
              <div className='drag-actions flex gap-2'>
                <button
                  aria-label='move answer up'
                  type='button'
                  onClick={() => {
                    move(index, index - 1)
                    setValue(`answers.${index}.position`, index, { shouldValidate: true })
                    setValue(`answers.${index - 1}.position`, index - 1, { shouldValidate: true })
                  }}
                  className='group flex cursor-pointer items-center gap-1 rounded-md py-1 text-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-300 dark:text-neutral-300/60 dark:disabled:text-neutral-600'
                  disabled={index <= 0}>
                  <ArrowUp className='size-5 group-enabled:hover:scale-110 group-enabled:hover:text-neutral-600/80 group-enabled:active:scale-125 dark:group-enabled:hover:text-neutral-300/80' />
                </button>
                <button
                  aria-label='move answer down'
                  type='button'
                  disabled={index + 1 >= fields.length}
                  onClick={() => {
                    move(index, index + 1)
                    setValue(`answers.${index}.position`, index, { shouldValidate: true })
                    setValue(`answers.${index + 1}.position`, index + 1, { shouldValidate: true })
                  }}
                  className='group flex cursor-pointer items-center gap-1 rounded-md py-1 text-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-200 dark:text-neutral-300/60 dark:disabled:text-neutral-600'>
                  <ArrowDown className='size-5 group-enabled:hover:scale-110 group-enabled:hover:text-neutral-600/80 group-enabled:active:scale-125 dark:group-enabled:hover:text-neutral-300/80' />
                </button>
                <DeleteAnswerOptionButton index={index} remove={remove} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <FieldError<ChoiceQuestion> field='answers' errors={errors} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FieldError<any> field='answers.root' errors={errors} />

      <AddAnswerButton type='drag-drop' watch={watch} append={append} />
    </>
  )
}

function DeleteAnswerOptionButton({ index, remove }: { index: number; remove: UseFieldArrayReturn<Question>['remove'] }) {
  return (
    <button aria-label='delete answer' type='button' onClick={() => remove(index)} className='group ml-1 flex cursor-pointer items-center gap-1 rounded-md py-1 focus:outline-0'>
      <Trash2 className='size-5 stroke-2 text-red-600/60 group-focus:scale-115 group-focus:text-red-500 dark:text-red-400/60 dark:group-focus:text-red-400/80' />
    </button>
  )
}

/**
 * This component renders the input for a given answer's `correctness` or `position` indicator and wraps the in in a label within a tooltip.
 * This means that for choice-questions users can click the label to change between `correct´ and `incorrect`.
 * When used for a drag-drop question it essentially displays its position (readonly)
 */
function CircleAnswer_IndicatorInput({
  register,
  registerProps,
  inputType,
  value,
  tooltipContent,
  children,
}: {
  register: UseFormReturn<Question>['register']
  registerProps: Parameters<UseFormReturn<Question>['register']>
  inputType: NonNullable<Required<HTMLProps<HTMLInputElement>['type']>>
  value?: HTMLProps<HTMLInputElement>['value']
  tooltipContent?: TooltipProps['content']
  children?: ReactNode | ReactNode[]
}) {
  return (
    <>
      <Tooltip tabIndex={-1} content={tooltipContent}>
        <label
          tabIndex={-1} // prevents the label from being accessible, instead users can access the input itself, even though it is not visible
          className='has-focus:ring-ring-focus dark:has-focus:ring-ring-focus flex size-6 items-center justify-center rounded-full bg-neutral-100/90 p-1 ring-1 ring-neutral-400 outline-0 hover:cursor-pointer has-focus:ring-[1.2px] dark:bg-transparent dark:ring-neutral-500'>
          {children}
          <input type={inputType} value={value} {...register(...registerProps)} className='appearance-none' />
        </label>
      </Tooltip>
    </>
  )
}
