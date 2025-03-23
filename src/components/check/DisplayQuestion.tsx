import type { Question } from '@/schemas/QuestionSchema'
import { LayoutGrid } from 'lucide-react'
import Card from '@/components/Shared/Card'
import React from 'react'
import { ChoiceQuestionAnswerOptions, DragDropAnswerOptions, OpenQuestionAnswerOption } from '@/components/check/QuestionVariants'

export default function DisplayQuestion(question: Question) {
  switch (question.type) {
    case 'single-choice':
      return <RenderQuestion question={question} answeringOptions={ChoiceQuestionAnswerOptions} />

    case 'multiple-choice':
      return <RenderQuestion question={question} answeringOptions={ChoiceQuestionAnswerOptions} />

    case 'open-question':
      return <RenderQuestion question={question} answeringOptions={OpenQuestionAnswerOption} />

    case 'drag-drop':
      return <RenderQuestion question={question} answeringOptions={DragDropAnswerOptions} />

    default:
      return null
  }
}

type RenderQuestionProps<Q> = {
  question: Q
  answeringOptions: (question: Q) => React.ReactElement
}

/**
 * This component renders a question within a Card and renders the provided answeringOptions for users to answer the question.
 * @param AnsweringOptions The component that renders the answering options for the question.
 */
function RenderQuestion<Q extends Question>({ answeringOptions: AnsweringOptions, question: { ...props } }: RenderQuestionProps<Q>) {
  const { points, category, question, type } = props

  return (
    <Card className='question flex flex-col gap-3 hover:bg-none' disableHoverStyles>
      <div className='header mb-2 flex flex-col border-b border-neutral-400 p-2 dark:border-neutral-500'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg'>Question X</h2>
          <span className='dark:text-neutral-200'>
            {points} point{points > 1 && 's'}
          </span>
        </div>
        <div className='flex justify-between'>
          <div className='flex items-center gap-1 text-sm text-neutral-400 dark:text-neutral-400'>
            <LayoutGrid className='size-3 stroke-neutral-400' />
            <span className='lowercase'>{category}</span>
          </div>
          <span className='text-sm text-neutral-400 dark:text-neutral-400'>{type}</span>
        </div>
      </div>

      <div className='px-2 tracking-wide'>{question}</div>
      <div className='mt-3 mb-2 flex h-full px-2'>
        <AnsweringOptions {...props} />
      </div>
    </Card>
  )
}
