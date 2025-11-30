import { ExaminationState } from '@/src/hooks/checks/[share_token]/ExaminationStore'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'

interface PreparationOptions {
  randomizeOrder?: boolean
}

/**
 * This functions initializes the `results` property of the ExaminationStore. This means that it will have the same structure (e.g. indicies) as the question-answers of the respective knowledgeCheck.
 * @param state The examinationState used to access the knowledgeCheck to mimic its structure
 * @returns
 */
export function initializeExaminationResults(state: ExaminationState) {
  return Array.from(state.knowledgeCheck.questions).map((question): ExaminationSchema['results'][number] => ({
    question_id: question.id,
    answer: Array.from({ length: (question?.answers as Partial<ChoiceQuestion[]>)?.length ?? 1 }).map((_, i): ExaminationSchema['results'][number]['answer'][number] => {
      switch (question.type) {
        case 'single-choice':
          return { label: question.answers.at(i)!.answer, selected: false }

        case 'multiple-choice':
          return { label: question.answers.at(i)!.answer, selected: false }

        case 'drag-drop':
          return { label: question.answers.at(i)!.answer, position: i }

        default:
          return {}
      }
    }),
  }))
}

/**
 * This function takes in a given knowledgeCheck and removes each answer's correctness information and randomizes their order.
 */
export default function prepareExaminationCheck(check: KnowledgeCheck, { randomizeOrder = true }: PreparationOptions = {}) {
  return {
    ...check,
    questions: check.questions.map(hideCorrectness).map(randomizeOrder ? randomizeAnswerOrder : (e) => e),
  }
}

function randomizeAnswerOrder(question: Question): Question {
  //todo randomize order
  return question
}

function hideCorrectness(question: Question): Question {
  if (question.type === 'single-choice' || question.type === 'multiple-choice') {
    question = question as ChoiceQuestion

    return {
      ...question,
      answers: question.answers.map((answer) => ({ ...answer, correct: false })),
    }
  } else if (question.type === 'open-question') {
    question = question as OpenQuestion

    return {
      ...question,
      expectation: '',
    }
  } else if (question.type === 'drag-drop') {
    question = question as DragDropQuestion

    return {
      ...question,
      answers: question.answers.map((answer) => ({ answer: answer })).map(({ answer }, i) => ({ ...answer, position: i })),
    }
  }

  return question
}
