import shuffle from 'lodash/shuffle'
import lorem from '@/src/lib/Shared/Lorem'
import { DragDropQuestion, MultipleChoice, OpenQuestion, Question, SingleChoice } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'
import { Any } from '@/types'

export default function createDummyQuestionInput(question: SingleChoice): Extract<QuestionInput, { type: 'single-choice' }>
export default function createDummyQuestionInput(question: MultipleChoice): Extract<QuestionInput, { type: 'multiple-choice' }>
export default function createDummyQuestionInput(question: DragDropQuestion): Extract<QuestionInput, { type: 'drag-drop' }>
export default function createDummyQuestionInput(question: OpenQuestion): Extract<QuestionInput, { type: 'open-question' }>
export default function createDummyQuestionInput(question: Question): QuestionInput
export default function createDummyQuestionInput(question: Question): QuestionInput {
  switch (question.type) {
    case 'single-choice': {
      return { question_id: question.id, type: question.type, selection: question.answers[randomIndex(question.answers)].id }
    }
    case 'multiple-choice': {
      return { question_id: question.id, type: question.type, selection: [question.answers[randomIndex(question.answers)].id, question.answers[randomIndex(question.answers)].id] }
    }
    case 'open-question': {
      return {
        question_id: question.id,
        type: question.type,
        input:
          Math.random() > 0.8
            ? ''
            : lorem()
                .split(' ')
                .slice(0, Math.round(Math.random() * 25) + 1)
                .join(' '),
      }
    }
    case 'drag-drop': {
      return { question_id: question.id, type: question.type, input: (Math.random() > 0.8 ? question.answers : shuffle(question.answers)).map((a) => a.id) }
    }
  }

  return null as Any
}

function randomIndex(array: Any[]): number {
  return Math.round(Math.random() * array.length) % array.length
}
