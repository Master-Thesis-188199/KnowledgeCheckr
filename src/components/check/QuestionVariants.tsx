import ChoiceQuestionOption from '@/components/check/ChoiceQuestionOption'
import { ChoiceQuestion } from '@/components/check/ChoiceQuestion'
import QuestionSelectionProvider from '@/components/check/QuestionSelectionProvider'
import { Question } from '@/schemas/QuestionSchema'
import DragDropContainer from '@/components/Shared/DragDropContainer'
import { MoveIcon } from 'lucide-react'

export function OpenQuestionAnswerOption() {
  return <textarea className='size-3.5 h-full min-h-60 flex-1 resize-none appearance-none rounded-md p-2 ring-1 ring-neutral-500 dark:bg-neutral-700/30 dark:ring-neutral-500/80' />
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

export function DragDropAnswerOptions(question: Extract<Question, { type: 'drag-drop' }>) {
  return (
    <DragDropContainer className='flex flex-1 flex-col gap-6 select-none' dragAxis='y'>
      {question.answers.map((answer, i) => (
        <div data-swapy-slot={i.toString(36)} key={i}>
          <div
            data-swapy-item={i.toString(36) + 'item'}
            className='flex items-center gap-4 rounded-md bg-neutral-300/40 p-3 px-4 ring-1 ring-neutral-400/50 select-none hover:cursor-pointer hover:bg-neutral-300/60 active:bg-neutral-400/40 has-checked:bg-neutral-300/80 has-checked:ring-2 has-checked:ring-neutral-400/80 dark:bg-neutral-700/40 dark:ring-neutral-500/80 dark:hover:bg-neutral-700/60 dark:active:bg-neutral-600/80 dark:has-checked:bg-neutral-600/80 dark:has-checked:ring-neutral-400/60'>
            <span className='current-position'>{i + 1}.</span>
            <span className='flex-1'>{answer.answer}</span>
            <button>
              <MoveIcon className='size-4.5 text-neutral-500 dark:text-neutral-300' />
            </button>
          </div>
        </div>
      ))}
    </DragDropContainer>
  )
}
