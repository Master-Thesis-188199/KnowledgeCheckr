import { getUUID } from '@/src/lib/Shared/getUUID'
import { ChoiceQuestion, Question, QuestionSchema } from '@/src/schemas/QuestionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleIcon } from 'lucide-react'
import { useForm, UseFormReset } from 'react-hook-form'

/**
 * This component renders a single exam question and will be used to store an user's answer
 */
export default function ExamQuestion({ question }: { question: Question }) {
  const { register, reset: resetInputs } = useForm<Question>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: question,
  })
  return (
    <form className='grid gap-6 rounded-md p-4 ring-1 dark:ring-neutral-600'>
      <input readOnly disabled className='text-lg font-semibold' value={question.question} />
      {(question.type === 'single-choice' || question.type === 'multiple-choice') && <ExamChoiceAnswer reset={resetInputs} question={question as ChoiceQuestion} />}
    </form>
  )
}

function ExamChoiceAnswer({ question, reset }: { question: ChoiceQuestion; reset: UseFormReset<Question> }) {
  return (
    <ul className='group flex flex-col gap-4 px-4'>
      {question.answers.map((answer) => (
        <label className='flex items-center gap-2 hover:cursor-pointer' key={getUUID()}>
          <input type={question.type === 'multiple-choice' ? 'checkbox' : 'radio'} className='peer hidden' name={`${question.id}-answer-checkbox`} />
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
