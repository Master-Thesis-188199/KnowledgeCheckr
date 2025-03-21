import ChoiceQuestionOption from '@/components/check/ChoiceQuestionOption'
import { ChoiceQuestion } from '@/components/check/ChoiceQuestion'
import QuestionSelectionProvider from '@/components/check/QuestionSelectionProvider'

export function OpenQuestionAnswerOption() {
  return <textarea className='size-3.5 h-full flex-1 resize-none appearance-none rounded-md p-2 ring-1 ring-neutral-500 dark:bg-neutral-700/30 dark:ring-neutral-500/80' />
}

export function ChoiceQuestionAnswerOptions(question: ChoiceQuestion) {
  return (
    <QuestionSelectionProvider maxSelection={question.type === 'single-choice' ? 1 : undefined} autoSwitchAnswer={question.type === 'single-choice'}>
      <div className='flex flex-1 flex-col gap-6'>
        {question.answers.map((answer, i) => (
          <ChoiceQuestionOption key={i + question.id} id={question.id} {...answer} />
        ))}
      </div>
    </QuestionSelectionProvider>
  )
}
