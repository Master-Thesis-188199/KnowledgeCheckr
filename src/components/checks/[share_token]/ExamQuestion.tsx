import { Question, QuestionSchema } from '@/src/schemas/QuestionSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
    </form>
  )
}
