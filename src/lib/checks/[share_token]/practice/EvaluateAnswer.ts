'use server'

import { getKnowledgeCheckQuestionById } from '@/database/knowledgeCheck/questions/select'
import { PracticeData, PracticeSchema } from '@/src/schemas/practice/PracticeSchema'
import { DragDropQuestion, MultipleChoice, OpenQuestion, SingleChoice } from '@/src/schemas/QuestionSchema'

export type AuthState = {
  success: boolean
  fieldErrors?: {
    [K in keyof PracticeData]?: string[]
  }
  rootError?: string
  values?: PracticeData
  feedback?: PracticeFeedback
}

export async function EvaluateAnswer(_: AuthState, data: PracticeData): Promise<AuthState> {
  console.log('Evaluating practice answers...', data)

  await new Promise((r) => setTimeout(r, 500))

  const parsed = PracticeSchema.safeParse(data)

  if (!parsed.success) {
    console.log("The practice-schema constraints weren't satisfied....", parsed.error.flatten())
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors, values: data }
  }

  const feedback = await createFeedback(data)
  return { success: true, values: data, feedback }
}

type SingleChoiceFeedback = Omit<Extract<PracticeData, { type: 'single-choice' }> & { reasoning?: string; solution: string }, 'question_id' | 'selection'>
type MultipleChoiceFeedback = Omit<Extract<PracticeData, { type: 'multiple-choice' }> & { reasoning?: string[]; solution: string[] }, 'question_id' | 'selection'>
type OpenQuestionFeedback = Omit<Extract<PracticeData, { type: 'open-question' }> & { reasoning?: string }, 'question_id'>
type DragDropFeedback = Omit<Extract<PracticeData, { type: 'drag-drop' }> & { reasoning?: string; solution: string[] }, 'question_id' | 'input'>

export type PracticeFeedback = SingleChoiceFeedback | MultipleChoiceFeedback | OpenQuestionFeedback | DragDropFeedback

async function createFeedback({ question_id, ...answer }: PracticeData): Promise<PracticeFeedback> {
  let question = await getKnowledgeCheckQuestionById(question_id)
  //todo: Generate question-feedback-reasoning using a local llm to explain the wrongful selection of answers to the user with a encouraging tone

  switch (answer.type) {
    case 'single-choice':
      question = question as SingleChoice
      return {
        type: answer.type,
        solution: question.answers.find((a) => a.correct)!.id,
        reasoning: 'This answer is correct because...',
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
      return {
        type: answer.type,
        input: question.expectation ?? '',
        reasoning: 'This answer is correct because...',
      }

    case 'drag-drop':
      question = question as DragDropQuestion
      return {
        type: answer.type,
        solution: question.answers.map((answer) => answer.id),
        reasoning: 'This answer is correct because...',
      }
  }
}
