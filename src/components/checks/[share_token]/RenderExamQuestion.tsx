import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormContext } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import DisplayChoiceQuestionAnswer from '@/src/components/checks/[share_token]/(shared)/(questions)/ChoiceQuestionAnswer'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import { Form } from '@/src/components/shadcn/form'
import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'
import { ExaminationActions } from '@/src/hooks/checks/[share_token]/ExaminationStore'
import debounceFunction from '@/src/hooks/Shared/debounceFunction'
import { stringifyObject } from '@/src/lib/log/StringifyObject'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion } from '@/src/schemas/QuestionSchema'
import { QuestionInput, QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { Any } from '@/types'

/**
 * This component renders a single exam question and will be used to store an user's answer
 */
export default function RenderExamQuestion() {
  const { saveAnswer, currentQuestionIndex, ...state } = useExaminationStore((state) => state)
  const question = state.knowledgeCheck.questions.at(currentQuestionIndex)!

  const form = useForm<QuestionInput>({
    resolver: zodResolver(QuestionInputSchema),
    defaultValues: {
      ...state.results[currentQuestionIndex],
      question_id: question.id,
      type: question.type as Any,
    },
  })
  const { getValues } = form

  const debounceSave = useMemo(() => debounceFunction(saveAnswer, 750), [saveAnswer])

  return (
    <Form {...form}>
      <form
        className='dark:ring-ring-subtle ring-ring-subtle relative grid gap-6 rounded-md p-4 ring-[1.5px]'
        onChange={() => {
          console.log(stringifyObject(getValues(), { pretified: true }))
          debounceSave(getValues())
        }}>
        {/* <input {...form.register(`results.${currentQuestionIndex}.question_id`)} value={state.knowledgeCheck.questions[currentQuestionIndex].id} className='hidden' /> */}
        <QuestionHeader title={question.question} index={currentQuestionIndex} variant={'inline-left'} />

        {(question.type === 'single-choice' || question.type === 'multiple-choice') && <ExamChoiceAnswers question={question as ChoiceQuestion} />}

        {question.type === 'open-question' && <ExamOpenQuestionAnswer />}
        {question.type === 'drag-drop' && <DragDropAnswers debounceSave={debounceSave} question={question} />}
      </form>
    </Form>
  )
}

function QuestionHeader({ title, index, variant = 'inline' }: { title: string; index: number; variant?: 'inline' | 'absolute' | 'inline-left' }) {
  if (variant === 'inline-left') return HeaderLeftInline({ title, index })
  if (variant === 'absolute') return HeaderAbsolute({ title, index })

  return HeaderInline({ title, index })
}

function HeaderLeftInline({ title, index }: { title: string; index: number }) {
  return (
    <div className='-mt-4 -ml-4 grid grid-cols-[auto_1fr] gap-3'>
      <div className='ring-ring dark:ring-ring flex max-h-10 items-center rounded-tl-md rounded-br-md bg-neutral-300 px-3.5 py-1.5 ring-1 dark:bg-neutral-600/60'>{index + 1}</div>
      <p className='mt-[0.4rem] text-lg font-semibold text-neutral-800 dark:text-neutral-200' children={title} />
    </div>
  )
}

function HeaderAbsolute({ title, index }: { title: string; index: number }) {
  return (
    <>
      <div className='ring-ring dark:ring-ring absolute top-0 left-0 rounded-tl-md rounded-br-md bg-neutral-300 px-3.5 py-1.5 ring-1 dark:bg-neutral-600/60'>{index + 1}</div>
      <input name='question' readOnly disabled className='mt-8 w-full text-lg font-semibold text-neutral-800 dark:text-neutral-200' value={title} />{' '}
    </>
  )
}

function HeaderInline({ title, index }: { title: string; index: number }) {
  return (
    <div className='flex gap-3'>
      <div className='ring-ring-hover dark:ring-ring rounded-full bg-neutral-300 px-2.5 py-0.5 tabular-nums ring-1 dark:bg-neutral-600/60'>{index + 1}</div>
      <input name='question' readOnly disabled className='w-full text-lg font-semibold text-neutral-800 dark:text-neutral-200' value={title} />
    </div>
  )
}

function ExamChoiceAnswers({ question }: { question: ChoiceQuestion }) {
  return (
    <ul className='group flex flex-col gap-4 px-4'>
      {question.answers.map((answer, index) =>
        // prettier-ignore
        <DisplayChoiceQuestionAnswer
          answer={answer}
          registerKey={question.type === 'single-choice' ? 'selection' : `selection.${index}`}
          key={answer.id}
          type={question.type}
        />,
      )}

      <ResetButton />
    </ul>
  )
}

function ResetButton() {
  const { reset } = useFormContext<QuestionInput>()

  return (
    <Button variant='link' type='button' className='-m-3 -ml-4 hidden w-fit text-sm text-neutral-500 underline-offset-2 group-has-[:checked]:flex dark:text-neutral-400' onClick={() => reset()}>
      Reset
    </Button>
  )
}

function ExamOpenQuestionAnswer() {
  const { register } = useFormContext<Extract<QuestionInput, { type: OpenQuestion['type'] }>>()

  return (
    <TextareaAutosize
      maxRows={10}
      {...register('input')}
      className={cn(
        'focus:ring-ring-focus dark:focus:ring-ring-focus hover:ring-ring-hover dark:hover:ring-ring-hover rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text focus:ring-[1.2px] dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
        'resize-none',
      )}
    />
  )
}

function DragDropAnswers({ debounceSave, question }: { question: DragDropQuestion; debounceSave: ReturnType<typeof debounceFunction<ExaminationActions['saveAnswer']>> }) {
  const { setValue, getValues } = useFormContext<Extract<QuestionInput, { type: DragDropQuestion['type'] }>>()

  let answers: DragDropQuestion['answers'] = question.answers.map((a, i) => ({ ...a, position: i }))

  //* Re-apply drag drop positions
  if (getValues()?.input?.length === question.answers.length) {
    answers = getValues().input.map((id, position) => ({
      answer: question.answers.find((a) => a.id === id)!.answer,
      position,
      id,
    }))
  }

  return (
    <DragDropContainer
      key={answers.map((a) => a.id).join(',')} // <-- forces container to re-render when its children change
      enabled
      onSwapStart={() => {
        debounceSave.abort()
      }}
      onSwapEnd={(e) => {
        e.slotItemMap.asArray.map((el, i) => setValue(`input.${i}` as const, el.item))
        debounceSave(getValues())
      }}
      className='flex flex-col gap-4'>
      {answers.map((a, i, array) => (
        <DragDropItem name={a.id} key={a.id + a.position} initialIndex={a.position ? a.position : i} showPositionCounter>
          <span className='flex-1'>{array.at(a.position ?? i)?.answer}</span>
        </DragDropItem>
      ))}
    </DragDropContainer>
  )
}
