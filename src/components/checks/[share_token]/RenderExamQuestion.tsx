import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'
import debounceFunction from '@/src/hooks/Shared/debounceFunction'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@/src/lib/Shared/utils'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { ChoiceQuestion, DragDropQuestion } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleIcon } from 'lucide-react'
import { useForm, UseFormReset, UseFormSetValue } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'

/**
 * This component renders a single exam question and will be used to store an user's answer
 */
export default function RenderExamQuestion() {
  const { saveAnswer, currentQuestionIndex, ...state } = useExaminationStore((state) => state)
  const question = state.knowledgeCheck.questions.at(currentQuestionIndex)!

  const {
    reset: resetInputs,
    setValue,
    getValues,
  } = useForm<ExaminationSchema>({
    resolver: zodResolver(ExaminationSchema),
    defaultValues: state,
  })

  const debounceSave = debounceFunction(saveAnswer, 750)

  return (
    <form className='grid gap-6 rounded-md p-4 ring-1 dark:ring-neutral-600' onChange={() => debounceSave(getValues().results.at(currentQuestionIndex)!)}>
      <input readOnly disabled className='text-lg font-semibold' value={question.question} />
      {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
        <ExamChoiceAnswer getValues={getValues} setValue={setValue} reset={resetInputs} question={question as ChoiceQuestion} />
      )}
      {question.type === 'open-question' && <ExamOpenQuestionAnswer setValue={setValue} reset={resetInputs} />}
      {question.type === 'drag-drop' && <DragDropAnswers setValue={setValue} reset={resetInputs} />}
    </form>
  )
}

function ExamChoiceAnswer({ question, reset, setValue }: { question: ChoiceQuestion; reset: UseFormReset<ExaminationSchema>; setValue: UseFormSetValue<ExaminationSchema>; getValues: () => Any }) {
  const { currentQuestionIndex, results } = useExaminationStore((state) => state)
  const answers = results.at(currentQuestionIndex)!.answer

  return (
    <ul className='group flex flex-col gap-4 px-4'>
      {question.answers.map((answer, index, array) => (
        <label className='flex items-center gap-2 hover:cursor-pointer' key={getUUID()}>
          <input
            type={question.type === 'multiple-choice' ? 'checkbox' : 'radio'}
            name={question.type === 'single-choice' ? 'answer.correct' : (`answers.${index}.correct` as const)}
            defaultChecked={answers.at(index)?.selected}
            onChange={(e) => {
              setValue(`results.${currentQuestionIndex}.answer.${index}.selected` as const, e.target.checked)

              //* Ensure single-choice questions only have a single answer
              if (question.type !== 'single-choice') return
              for (let i = 0; i < array.length; i++) {
                if (i === index) continue
                setValue(`results.${currentQuestionIndex}.answer.${i}.selected` as const, false)
              }
            }}
            className='peer hidden'
          />
          <CircleIcon className='size-4.5 peer-checked:fill-neutral-300' />
          {answer.answer}
        </label>
      ))}
      <button type='button' className='hidden underline-offset-2 group-has-[:checked]:flex hover:cursor-pointer hover:underline dark:text-neutral-400' onClick={() => reset()}>
        Reset
      </button>
    </ul>
  )
}

function ExamOpenQuestionAnswer({ setValue }: { reset: UseFormReset<ExaminationSchema>; setValue: UseFormSetValue<ExaminationSchema> }) {
  const { currentQuestionIndex, results } = useExaminationStore((state) => state)

  return (
    <TextareaAutosize
      maxRows={10}
      defaultValue={results.at(currentQuestionIndex)?.answer.at(0)?.text ?? ''}
      onChange={(e) => {
        setValue(`results.${currentQuestionIndex}.answer.0.text` as const, e.target.value)
      }}
      className={cn(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
        'resize-none',
      )}
    />
  )
}

function DragDropAnswers({ setValue }: { reset: UseFormReset<ExaminationSchema>; setValue: UseFormSetValue<ExaminationSchema> }) {
  const { currentQuestionIndex, results, knowledgeCheck } = useExaminationStore((state) => state)

  return (
    <DragDropContainer className='flex flex-col gap-4'>
      {results.at(currentQuestionIndex)?.answer.map((a, i) => (
        <DragDropItem key={i} initialIndex={i} showPositionCounter onSwap={(e) => setValue(`results.${currentQuestionIndex}.answer.${i}.position` as const, e.detail.new_pos)}>
          <span className='flex-1'>{(knowledgeCheck.questions.at(currentQuestionIndex)! as Any as DragDropQuestion).answers.at(i)?.answer}</span>
        </DragDropItem>
      ))}
    </DragDropContainer>
  )
}
