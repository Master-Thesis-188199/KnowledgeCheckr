import shuffle from 'lodash/shuffle'
import { ExaminationState } from '@/src/hooks/checks/[share_token]/ExaminationStore'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'

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
 * This function takes in a given knowledgeCheck and removes each answer's correctness information and either randomizes the question- and answer-option orders depending on the KnowledgeCheck-settings.
 */
export default function prepareExaminationCheck(check: KnowledgeCheck) {
  let questions = check.settings.questionOrder === 'create-order' ? check.questions : shuffleArray(check.questions)

  questions = questions
    .filter((q) => q.accessibility === 'all' || q.accessibility === 'exam-only')
    .map(hideCorrectness)
    .map(sortAnswers(check.settings.answerOrder))

  return {
    ...check,
    questions,
  }
}

/**
 * This wrapper function takes in the order in which the answers should be sorted by the function it returns.
 * @param order The order in which the respective answers should be sorted
 * @returns A function that takes in the respective question, sorts its answers and returns the modified question.
 */
function sortAnswers(order?: NonNullable<KnowledgeCheck['settings']>['answerOrder']) {
  return (question: Question) => {
    if (!order || order === 'create-order') return question

    switch (question.type) {
      case 'single-choice':
        return { ...question, answers: shuffleArray(question.answers) }
      case 'multiple-choice':
        return { ...question, answers: shuffleArray(question.answers) }
      case 'drag-drop':
        return { ...question, answers: shuffleArray(question.answers).map((a, i) => ({ ...a, position: i })) }
    }

    return question
  }
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

function shuffleArray<T extends { id: string }>(array: T[], shuffleCount = 0): T[] {
  const shuffled = shuffle(array)

  //* ensure that the shuffled array is actually different from the original one
  if (shuffled.every((item, index) => item.id === array[index].id)) {
    if (shuffleCount >= 5) {
      throw new Error("Shuffling array didn't produce a different order after 5 attempts!")
    }

    console.log('Reshuffling array to avoid same order...')
    return shuffleArray(array, shuffleCount + 1)
  }

  return shuffled
}
