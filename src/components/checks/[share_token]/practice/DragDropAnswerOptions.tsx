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

export function DragDropAnswerOptions({ question, state }: { question: DragDropQuestion; isEvaluated: boolean; state: PracticeFeedbackServerState }) {
  return (
    <>
      {state.values?.type === 'drag-drop' && state.values?.input?.length === question.answers.length && state.values.question_id === question.id
        ? //* Displays the answers from the submitted data, because `question.answers` was not modified and the component was re-rendered after submission, to not loose order
          state.values.input.map((answer_id, pos) => (
            <DragDropItem key={answer_id} name={answer_id}>
              <DragDropItemPositionCounter initialIndex={pos} />
              {question.answers.find((a) => a.id === answer_id)?.answer ?? 'Unknown Answer'} (ev)
            </DragDropItem>
          ))
        : question.answers.map((a, initPos) => (
            <DragDropItem key={a.id} name={a.id}>
              <DragDropItemPositionCounter initialIndex={initPos} />
              {a.answer}
            </DragDropItem>
          ))}
    </>
  )
}
