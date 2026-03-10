'use server'

import { getKnowledgeCheckQuestionById } from '@/database/knowledgeCheck/questions/select'
import _logger from '@/src/lib/log/Logger'
import lorem from '@/src/lib/Shared/Lorem'
import { ChoiceQuestion, DragDropQuestion, MultipleChoice, OpenQuestion, SingleChoice } from '@/src/schemas/QuestionSchema'
import { QuestionInput, QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export type PracticeFeedbackServerState = {
  success: boolean
  fieldErrors?: { [key in keyof QuestionInput]?: string[] }
  rootError?: string
  values?: QuestionInput
  feedback?: PracticeFeedback
}

export async function EvaluateAnswer(_: PracticeFeedbackServerState, data: QuestionInput): Promise<PracticeFeedbackServerState> {
  logger.info('Evaluating practice answers...', data)

  await new Promise((r) => setTimeout(r, 500))

  const parsed = QuestionInputSchema.safeParse(data)

  if (!parsed.success) {
    logger.info("The practice-schema constraints weren't satisfied....", parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors, values: data }
  }

  const feedback = await createFeedback(data)
  return { success: true, values: data, feedback }
}

type FeedbackMap = Map<ChoiceQuestion['answers'][number]['id'] | DragDropQuestion['answers'][number]['id'], string>

type SingleChoiceFeedback = Omit<Extract<QuestionInput, { type: 'single-choice' }> & { reasoning?: FeedbackMap; solution: string; type: 'single-choice' }, 'question_id' | 'selection'>
type MultipleChoiceFeedback = Omit<Extract<QuestionInput, { type: 'multiple-choice' }> & { reasoning?: FeedbackMap; solution: string[]; type: 'multiple-choice' }, 'question_id' | 'selection'>
type OpenQuestionFeedback = Omit<
  Extract<QuestionInput, { type: 'open-question' }> & { reasoning?: string; type: 'open-question'; degreeOfCorrectness: number; solution?: string },
  'question_id' | 'input'
>
type DragDropFeedback = Omit<Extract<QuestionInput, { type: 'drag-drop' }> & { reasoning?: FeedbackMap; solution: string[]; type: 'drag-drop' }, 'question_id' | 'input'>

export type PracticeFeedback = SingleChoiceFeedback | MultipleChoiceFeedback | OpenQuestionFeedback | DragDropFeedback

async function createFeedback({ question_id, ...answer }: QuestionInput): Promise<PracticeFeedback | undefined> {
  let question = await getKnowledgeCheckQuestionById(question_id)

  if (!question) {
    logger.warn(`Question with id ${question_id} not found when creating feedback.`)
    return undefined
  }

  //todo: Generate question-feedback-reasoning using a local llm to explain the wrongful selection of answers to the user with a encouraging tone

  switch (answer.type) {
    case 'single-choice': {
      question = question as SingleChoice

      const feedback: FeedbackMap = new Map()

      question.answers
        // produce feedback for selected option(s) and the correct one that was not selected
        .filter((a) => (answer.selection === a.id && !a.correct) || (answer.selection !== a.id && a.correct))
        .forEach((answer, i) =>
          feedback.set(
            answer.id,
            answer.correct ? `Answer ${i} is correct because ${lorem().split(' ').slice(0, 30).join(' ')}` : `Answer ${i} is false because ${lorem().split(' ').slice(0, 30).join(' ')}`,
          ),
        )

      return {
        type: answer.type,
        solution: question.answers.find((a) => a.correct)!.id,
        reasoning: feedback,
      }
    }

    case 'multiple-choice': {
      question = question as MultipleChoice

      const feedback: FeedbackMap = new Map()

      question.answers
        // produce feedback for selected option(s) and the correct one that was not selected
        .filter((a) => (answer.selection.includes(a.id) && !a.correct) || (!answer.selection.includes(a.id) && a.correct))
        .forEach((answer, i) =>
          feedback.set(
            answer.id,
            answer.correct ? `Answer ${i} is correct because ${lorem().split(' ').slice(0, 30).join(' ')}` : `Answer ${i} is false because ${lorem().split(' ').slice(0, 30).join(' ')}`,
          ),
        )

      return {
        type: answer.type,
        solution: question.answers.filter((a) => a.correct).map((answer) => answer.id),
        reasoning: feedback,
      }
    }

    case 'open-question':
      question = question as OpenQuestion
      //todo: use llm to evaluate open-question answer correctness
      let degreeOfCorrectness = Math.random()
      degreeOfCorrectness = answer.input.toLowerCase().includes('correct') ? 1 : 0

      return {
        type: answer.type,
        solution: question.expectation,
        reasoning: `This answer is ${degreeOfCorrectness >= 0.5 ? 'correct' : 'incorrect'} because ${lorem().split(' ').slice(0, 30).join(' ')}`,
        degreeOfCorrectness: degreeOfCorrectness,
      }

    case 'drag-drop':
      question = question as DragDropQuestion
      const orderedAnswers = question.answers.toSorted((a, b) => a.position - b.position)
      const correctlyOrdered = orderedAnswers.map((a) => a.id)

      const feedback: FeedbackMap = new Map()

      question.answers
        .filter((a, i) => answer.input.at(i) !== a.id)
        .forEach((a, i) =>
          feedback.set(a.id, `Answer (${orderedAnswers.find(({ id }) => id === answer.input.at(i))?.answer}) at position ${i + 1} is false because ${lorem().split(' ').slice(0, 30).join(' ')}`),
        )

      return {
        type: answer.type,
        solution: correctlyOrdered,
        reasoning: feedback,
      }
  }
}
