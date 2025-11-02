import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'
import DragDropContainer from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItem } from '@/src/components/Shared/drag-drop/DragDropItem'
import { DragDropItemPositionCounter } from '@/src/components/Shared/drag-drop/DragDropPositionCounter'
import { PracticeFeedbackServerState } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import { DragDropQuestion } from '@/src/schemas/QuestionSchema'

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

  return options.map(({ id, answer, position }) => (
    <DragDropItem key={id} name={id}>
      <DragDropItemPositionCounter initialIndex={position} />
      {answer}
    </DragDropItem>
  ))
}
