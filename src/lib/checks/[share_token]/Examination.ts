import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion, Question } from '@/src/schemas/QuestionSchema'

interface PreparationOptions {
  randomizeOrder?: boolean
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
