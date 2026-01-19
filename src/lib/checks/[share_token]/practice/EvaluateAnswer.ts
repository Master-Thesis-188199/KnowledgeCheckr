'use server'

import { getKnowledgeCheckQuestionById } from '@/database/knowledgeCheck/questions/select'
import _logger from '@/src/lib/log/Logger'
import { PracticeData, PracticeSchema } from '@/src/schemas/practice/PracticeSchema'
import { DragDropQuestion, MultipleChoice, OpenQuestion, SingleChoice } from '@/src/schemas/QuestionSchema'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export type PracticeFeedbackServerState = {
  success: boolean
  fieldErrors?: { [key in keyof PracticeData]?: string[] }
  rootError?: string
  values?: Partial<PracticeData>
  feedback?: PracticeFeedback
}

export async function EvaluateAnswer(_: PracticeFeedbackServerState, data: PracticeData): Promise<PracticeFeedbackServerState> {
  logger.info('Evaluating practice answers...', data)

  await new Promise((r) => setTimeout(r, 500))

  const parsed = PracticeSchema.safeParse(data)

  if (!parsed.success) {
    logger.info("The practice-schema constraints weren't satisfied....", parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors, values: data }
  }

  const feedback = await createFeedback(data)
  return { success: true, values: data, feedback }
}

type SingleChoiceFeedback = Omit<Extract<PracticeData, { type: 'single-choice' }> & { reasoning?: string[]; solution: string; type: 'single-choice' }, 'question_id' | 'selection'>
type MultipleChoiceFeedback = Omit<Extract<PracticeData, { type: 'multiple-choice' }> & { reasoning?: string[]; solution: string[]; type: 'multiple-choice' }, 'question_id' | 'selection'>
type OpenQuestionFeedback = Omit<
  Extract<PracticeData, { type: 'open-question' }> & { reasoning?: string; type: 'open-question'; degreeOfCorrectness: number; solution?: string },
  'question_id' | 'input'
>
type DragDropFeedback = Omit<Extract<PracticeData, { type: 'drag-drop' }> & { reasoning?: string[]; solution: string[]; type: 'drag-drop' }, 'question_id' | 'input'>

export type PracticeFeedback = SingleChoiceFeedback | MultipleChoiceFeedback | OpenQuestionFeedback | DragDropFeedback

async function createFeedback({ question_id, ...answer }: PracticeData): Promise<PracticeFeedback | undefined> {
  let question = await getKnowledgeCheckQuestionById(question_id)

  if (!question) {
    logger.warn(`Question with id ${question_id} not found when creating feedback.`)
    return undefined
  }

  //todo: Generate question-feedback-reasoning using a local llm to explain the wrongful selection of answers to the user with a encouraging tone

  switch (answer.type) {
    case 'single-choice':
      question = question as SingleChoice
      return {
        type: answer.type,
        solution: question.answers.find((a) => a.correct)!.id,
        reasoning: question.answers.map((answer, i) => (answer.correct ? `Answer ${i} is correct because...` : `Answer ${i} is false because..`)),
      }

    case 'multiple-choice':
      question = question as MultipleChoice
      return {
        type: answer.type,
        solution: question.answers.filter((a) => a.correct).map((answer) => answer.id),
        reasoning: question.answers.map((answer, i) => (answer.correct ? `Answer ${i} is correct because...` : `Answer ${i} is false because..`)),
      }

    case 'open-question':
      question = question as OpenQuestion
      //todo: use llm to evaluate open-question answer correctness
      let degreeOfCorrectness = Math.random()
      degreeOfCorrectness = answer.input.toLowerCase().includes('correct') ? 1 : 0

      return {
        type: answer.type,
        solution: question.expectation,
        reasoning: `This answer is ${degreeOfCorrectness >= 0.5 ? 'correct' : 'incorrect'} because...`,
        degreeOfCorrectness: degreeOfCorrectness,
      }

    case 'drag-drop':
      question = question as DragDropQuestion
      const orderedAnswers = question.answers.toSorted((a, b) => a.position - b.position)
      const correctlyOrdered = orderedAnswers.map((a) => a.id)

      return {
        type: answer.type,
        solution: correctlyOrdered,
        reasoning: correctlyOrdered.map((id, i) =>
          answer.input.at(i) === id
            ? `Answer (${orderedAnswers.find(({ id }) => id === answer.input.at(i))?.answer}) at position ${i + 1} is correct because...`
            : `Answer (${orderedAnswers.find(({ id }) => id === answer.input.at(i))?.answer}) at position ${i + 1} is false because..`,
        ),
      }
  }
}
