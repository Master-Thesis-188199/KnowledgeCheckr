import { DragDropQuestion, MultipleChoice, OpenQuestion, Question, SingleChoice } from '@/src/schemas/QuestionSchema'
import { QuestionInput, safeParseQuestionInput } from '@/src/schemas/UserQuestionInputSchema'
import { Any } from '@/types'

export function computeQuestionInputScore(question: Question, answer: QuestionInput, options?: { selectionTolerance?: number }) {
  if (!safeParseQuestionInput(answer).success) return null

  const answerScore = handleQuestionType(question, answer, {
    onSingleQuestion: function (singleChoice: SingleChoice, input) {
      const correctAnswer = singleChoice.answers.find((a) => a.correct)
      if (!correctAnswer) {
        console.warn('[copmuteQInputScore]: Correct answer for single-choice question not found...')
        console.log(singleChoice)
        return 0
      }

      return input.selection === correctAnswer.id ? singleChoice.points : 0
    },
    onMultipleChoice: function (multipleChoice: MultipleChoice, input) {
      const correctAnswers = multipleChoice.answers.filter((a) => a.correct)
      if (options?.selectionTolerance) {
        return correctAnswers.filter((answer) => !input.selection.includes(answer.id)).length <= options.selectionTolerance ? multipleChoice.points : 0
      }

      return correctAnswers.every((answer) => input.selection.includes(answer.id)) ? multipleChoice.points : 0
    },
    onDragDrop: function (dragDrop: DragDropQuestion, input) {
      const correctAnswers = dragDrop.answers.toSorted((a, b) => a.position - b.position)

      return correctAnswers.every((answer, index) => input.input.length === correctAnswers.length && input.input[index] === answer.id) ? dragDrop.points : 0
    },
    onOpenQuestion: function () {
      return -1
    },
  })

  return answerScore
}

function handleQuestionType<TReturn = Any>(
  question: Question,
  input: QuestionInput,
  callbacks: {
    onSingleQuestion: (singleChoice: SingleChoice, input: Extract<QuestionInput, { type: 'single-choice' }>) => TReturn
    onMultipleChoice: (multipleChoice: MultipleChoice, input: Extract<QuestionInput, { type: 'multiple-choice' }>) => TReturn
    onDragDrop: (dragDrop: DragDropQuestion, input: Extract<QuestionInput, { type: 'drag-drop' }>) => TReturn
    onOpenQuestion: (openChoice: OpenQuestion, input: Extract<QuestionInput, { type: 'open-question' }>) => TReturn
  },
) {
  switch (question.type) {
    case 'single-choice':
      if (question.type !== input.type) throw Error('QuestionInput does not match question type!')

      return callbacks.onSingleQuestion(question, input)
    case 'multiple-choice':
      if (question.type !== input.type) throw Error('QuestionInput does not match question type!')
      return callbacks.onMultipleChoice(question, input)
    case 'open-question':
      if (question.type !== input.type) throw Error('QuestionInput does not match question type!')
      return callbacks.onOpenQuestion(question, input)
    case 'drag-drop':
      if (question.type !== input.type) throw Error('QuestionInput does not match question type!')
      return callbacks.onDragDrop(question, input)
  }
}
