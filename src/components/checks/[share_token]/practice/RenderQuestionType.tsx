import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'

/**
 * This components takes in the respective question as an arugment and provides render-handlers for each type of question.
 * This way the distinction of the different question-types must not be done manually whenever the question object is used.
 * @param question The question that is to be rendered
 * @param singleChoice The render-helper that will be applied when the question-type is 'single-choice'.
 * @param multipleChoice The render-helper that will be applied when the question-type is 'multiple-choice'.
 * @param openQuestion The render-helper that will be applied when the question-type is 'open-question'.
 * @param dragDrop The render-helper that will be applied when the question-type is 'drag-drop'.
 */
export default function RenderQuestionType({
  question,
  singleChoice,
  multipleChoice,
  dragDrop,
  openQuestion,
}: {
  question?: Question
  singleChoice: (question: ChoiceQuestion) => React.ReactElement[]
  multipleChoice: (question: ChoiceQuestion) => React.ReactElement[]
  openQuestion: (question: OpenQuestion) => React.ReactElement
  dragDrop: (question: DragDropQuestion) => React.ReactElement[]
}) {
  if (!question) return null

  switch (question.type) {
    case 'single-choice':
      return singleChoice(question)
    case 'multiple-choice':
      return multipleChoice(question)
    case 'open-question':
      return openQuestion(question)
    case 'drag-drop':
      return dragDrop(question)
  }
}
