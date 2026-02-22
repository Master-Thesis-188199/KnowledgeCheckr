import { ArrowUpFromLineIcon, CheckIcon, XIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'
import { DragDropItemPositionCounter } from '@/src/components/Shared/drag-drop/DragDropPositionCounter'
import { DragDropFeedbackEvaluation, usePracticeFeeback } from '@/src/hooks/checks/[share_token]/practice/usePracticeFeedback'
import { PracticeFeedbackServerState } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { cn } from '@/src/lib/Shared/utils'
import { DragDropQuestion } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'

/**
 * Renders the answer-options for a drag-drop question within a drag-and-drop container. Depending on the provided props it allows interaction for reordering answers or displays feedback based on the feedback and submission.
 */
export default function DragDropAnswers({ isEvaluated, ...props }: { question: DragDropQuestion; isEvaluated: boolean; state: PracticeFeedbackServerState }) {
  const { setValue, trigger } = useFormContext<QuestionInput>()

  return (
    <DragDropContainer
      hideMoveIndicators={isEvaluated}
      key={props.question.id + props.question.type + isEvaluated.toString()}
      className='col-span-2 my-auto space-y-6'
      enabled={!isEvaluated}
      onSwapEnd={(e) => {
        e.slotItemMap.asArray.map((el, i) => setValue(`input.${i}` as const, el.item))
        trigger('input')
      }}>
      <DragDropAnswerOptions {...props} isEvaluated={isEvaluated} />
    </DragDropContainer>
  )
}

function DragDropAnswerOptions({ question, state, isEvaluated }: { question: DragDropQuestion; isEvaluated: boolean; state: PracticeFeedbackServerState }) {
  //? default: display the answers in their given order, but update position to be their index to prevent data leakage.
  let options: DragDropQuestion['answers'] = question.answers.map((a, i) => ({ ...a, position: i }))

  if (isEvaluated && state.values?.type === 'drag-drop' && state.values?.input?.length === question.answers.length && state.values.question_id === question.id) {
    //? Order question answers based on submitted positions
    options = state.values.input.map((id, submittedPos) => {
      const answer = question.answers.find((a) => a.id === id)
      return { id, answer: answer?.answer ?? 'Failed to retrieve `answer`', position: submittedPos }
    })
  }

  const getFeedbackEvaluation = usePracticeFeeback(state, {
    isSubmitSuccessful: isEvaluated,
    isSubmitted: isEvaluated,
    isPending: false,
    isSubmitting: false,
  })

  const feedbackEvaluation = getFeedbackEvaluation(question)

  return options.map(({ id, answer, position }, i) => (
    <DragDropItem
      key={id}
      name={id}
      title={isEvaluated ? feedbackEvaluation.reasoning?.at(i) : undefined}
      className={cn(isEvaluated && 'cursor-help')}
      data-evaluation-result={isEvaluated ? (feedbackEvaluation.isCorrectlyPositioned(id) ? 'correct' : feedbackEvaluation.isFalslyPositioned(id) ? 'incorrect' : 'none') : undefined}>
      <DragDropItemPositionCounter initialIndex={position} />
      {answer}
      <AnswerFeedback show={isEvaluated} id={id} feedbackEvaluation={feedbackEvaluation} position={position} />
    </DragDropItem>
  ))
}

function AnswerFeedback({
  show,
  position,
  feedbackEvaluation,
  id,
}: {
  show: boolean
  id: DragDropQuestion['answers'][number]['id']
  feedbackEvaluation: DragDropFeedbackEvaluation
  position: number
}) {
  if (!show) return null

  const correctPosition = feedbackEvaluation.getCorrectPosition(id)

  return (
    <div className='drag-drop-feedback-indicators ml-auto flex items-center gap-2'>
      {feedbackEvaluation.isCorrectlyPositioned(id) ? (
        <CheckIcon className='size-4 text-green-600 dark:text-green-500/70' />
      ) : (
        <div className='flex items-center gap-4 text-red-600/70 dark:text-red-500/70'>
          <div className='flex items-center gap-1'>
            {Array.from({ length: Math.abs(correctPosition - position) }).map((_, i) => (
              <ArrowUpFromLineIcon key={i} className={cn('size-4.5', correctPosition - position > 0 && 'rotate-180')} />
            ))}
          </div>
          <XIcon className='size-4' />
        </div>
      )}
    </div>
  )
}
