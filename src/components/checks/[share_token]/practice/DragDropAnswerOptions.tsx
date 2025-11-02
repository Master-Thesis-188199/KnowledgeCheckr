import { ArrowUpFromLineIcon, CheckIcon, XIcon } from 'lucide-react'
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'
import { DragDropItemPositionCounter } from '@/src/components/Shared/drag-drop/DragDropPositionCounter'
import { usePracticeFeeback } from '@/src/hooks/checks/[share_token]/practice/usePracticeFeedback'
import { PracticeFeedbackServerState } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { cn } from '@/src/lib/Shared/utils'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import { DragDropQuestion } from '@/src/schemas/QuestionSchema'

/**
 * Renders the answer-options for a drag-drop question within a drag-and-drop container. Depending on the provided props it allows interaction for reordering answers or displays feedback based on the feedback and submission.
 */
export default function DragDropAnswers({
  isEvaluated,
  setValue,
  trigger,
  ...props
}: {
  question: DragDropQuestion
  isEvaluated: boolean
  state: PracticeFeedbackServerState
  setValue: UseFormSetValue<PracticeData>
  trigger: UseFormTrigger<PracticeData>
}) {
  return (
    <DragDropContainer
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

  const { isCorrectlyPositioned, isFalslyPositioned } = getFeedbackEvaluation(question)

  return options.map(({ id, answer, position }) => (
    <DragDropItem key={id} name={id} data-evaluation-result={isEvaluated ? (isCorrectlyPositioned(id) ? 'correct' : isFalslyPositioned(id) ? 'incorrect' : 'none') : undefined}>
      <DragDropItemPositionCounter initialIndex={position} />
      {answer}
      <AnswerFeedback show={isEvaluated} state={state} answerId={id} />
    </DragDropItem>
  ))
}

function AnswerFeedback({ show, state: { feedback, values: submission }, answerId }: { show: boolean; state: PracticeFeedbackServerState; answerId: DragDropQuestion['answers'][number]['id'] }) {
  if (!show || !submission || submission.type !== 'drag-drop' || !feedback || feedback.type !== 'drag-drop') return null

  const correctPos = feedback.solution.findIndex((id) => id === answerId)
  const submissionPos = submission.input.findIndex((id) => id === answerId)
  const isCorrect = correctPos === submissionPos
  const movesNeeded = correctPos - submissionPos

  return (
    <span className='ml-auto flex items-center gap-2' title={`Answer should be at ${correctPos + 1}. position`}>
      {isCorrect ? (
        <CheckIcon className='size-4 text-green-500/70' />
      ) : (
        <div className='flex items-center gap-4 text-red-500/70'>
          <div className='flex items-center gap-1'>
            {Array.from({ length: Math.abs(movesNeeded) }).map((_, i) => (
              <ArrowUpFromLineIcon key={i} className={cn('size-4.5', correctPos - submissionPos > 0 && 'rotate-180')} />
            ))}
          </div>
          <XIcon className='size-4' />
        </div>
      )}
    </span>
  )
}
