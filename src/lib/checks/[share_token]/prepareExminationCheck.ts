'use server'

import shuffle from 'lodash/shuffle'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

/**
 * This function takes in a given knowledgeCheck and removes each answer's correctness information and either randomizes the question- and answer-option orders depending on the KnowledgeCheck-settings.
 */
export default async function prepareExaminationCheck(check: KnowledgeCheck) {
  let questions = check.settings.examination.questionOrder === 'create-order' ? check.questions : shuffleArray(check.questions)

  questions = questions
    .filter((q) => q.accessibility === 'all' || q.accessibility === 'exam-only')
    .map(hideCorrectness)
    .map(sortAnswers(check.settings.examination.answerOrder))

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
function sortAnswers(order?: NonNullable<KnowledgeCheck['settings']>['examination']['answerOrder']) {
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
  if (array.length <= 1) {
    logger.warn(`[shuffleArray]: Array of length ${array.length} cannot be shuffled properly. Returning original array.`)
    return array
  }

  const shuffled = shuffle(array)

  //* ensure that the shuffled array is actually different from the original one
  if (shuffled.every((item, index) => item.id === array[index].id)) {
    if (shuffleCount >= 5) {
      throw new Error("Shuffling array didn't produce a different order after 5 attempts!")
    }

    logger.info('Reshuffling array to avoid same order...')
    return shuffleArray(array, shuffleCount + 1)
  }

  return shuffled
}
