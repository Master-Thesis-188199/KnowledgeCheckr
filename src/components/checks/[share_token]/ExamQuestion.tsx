import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import debounceFunction from '@/src/hooks/Shared/debounceFunction'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion, Question, QuestionSchema } from '@/src/schemas/QuestionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleIcon } from 'lucide-react'
import { useForm, UseFormReset, UseFormSetValue } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'

/**
 * This component renders a single exam question and will be used to store an user's answer
 */
export default function ExamQuestion({ question }: { question: Question }) {
  const { saveQuestion } = useExaminationStore((state) => state)
  const {
    reset: resetInputs,
    setValue,
    getValues,
  } = useForm<Question>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: question,
  })

  const debounceSaveQuestion = debounceFunction(saveQuestion, 750)

  return (
    <form className='grid gap-6 rounded-md p-4 ring-1 dark:ring-neutral-600' onChange={() => debounceSaveQuestion(getValues())}>
      <input readOnly disabled className='text-lg font-semibold' value={question.question} />
      {(question.type === 'single-choice' || question.type === 'multiple-choice') && <ExamChoiceAnswer setValue={setValue} reset={resetInputs} question={question as ChoiceQuestion} />}
      {question.type === 'open-question' && <ExamOpenQuestionAnswer reset={resetInputs} />}
    </form>
  )
}

function ExamChoiceAnswer({ question, reset, setValue }: { question: ChoiceQuestion; reset: UseFormReset<Question>; setValue: UseFormSetValue<Question> }) {
  return (
    <ul className='group flex flex-col gap-4 px-4'>
      {question.answers.map((answer, index, array) => (
        <label className='flex items-center gap-2 hover:cursor-pointer' key={getUUID()}>
          <input
            type={question.type === 'multiple-choice' ? 'checkbox' : 'radio'}
            name={question.type === 'single-choice' ? 'answer.correct' : (`answers.${index}.correct` as const)}
            defaultChecked={answer.correct}
            onChange={(e) => {
              setValue(`answers.${index}.correct` as const, e.target.checked)

              //* Ensure single-choice questions only have a single answer
              if (question.type !== 'single-choice') return
              for (let i = 0; i < array.length; i++) {
                if (i === index) continue
                setValue(`answers.${i}.correct` as const, false)
              }
            }}
            className='peer hidden'
          />
          <CircleIcon className='size-4.5 peer-checked:fill-neutral-300' />
          {answer.answer}
        </label>
      ))}
      <button type='button' className='hidden underline-offset-2 group-has-[:checked]:flex hover:cursor-pointer hover:underline dark:text-neutral-400' onClick={() => reset(question)}>
        Reset
      </button>
    </ul>
  )
}

function ExamOpenQuestionAnswer({ reset }: { reset: UseFormReset<Question> }) {
  return (
    <TextareaAutosize
      maxRows={10}
      className={cn(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
        'resize-none',
      )}
    />
  )
}
