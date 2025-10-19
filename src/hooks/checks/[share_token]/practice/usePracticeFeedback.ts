'use client'

import { AuthState, PracticeFeedback } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import { ChoiceQuestion, DragDropQuestion, MultipleChoice, OpenQuestion, Question, SingleChoice } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'
import { FormState } from 'react-hook-form'

type ChoiceFeedbackEvaluation<Type extends ChoiceQuestion['type']> = FeedbackEvaluation<Type> & {
  isCorrectlySelected: (answer: ChoiceQuestion['answers'][number]) => boolean
  isMissingSelection: (answer: ChoiceQuestion['answers'][number]) => boolean
  isFalslySelected: (answer: ChoiceQuestion['answers'][number]) => boolean
}

type FeedbackEvaluation<Type extends Question['type']> = {
  type: Type
  feedback?: Extract<PracticeFeedback, { type: Type }>
  submittedAnswers?: Extract<PracticeData, { type: Type }>
}

type PracticeFeedbackReturn =
  | ChoiceFeedbackEvaluation<SingleChoice['type']>
  | ChoiceFeedbackEvaluation<MultipleChoice['type']>
  | FeedbackEvaluation<OpenQuestion['type']>
  | FeedbackEvaluation<DragDropQuestion['type']>
/**
 * This hook returns a simple utility function used to determine whether or not a answer-option was select correctly, wrongfuly or should have been selected (missing).
 * @param state The useActionState state
 * @param formState The form-state that is used to enable the evalation-helper function. When the form is not yet submitted, it has not been evaluated by the server, thus no feedback exists.
 * @returns
 */
export function usePracticeFeeback(
  state: AuthState,
  { isPending, isSubmitSuccessful, isSubmitted, isSubmitting }: Pick<FormState<Any>, 'isSubmitting' | 'isSubmitted' | 'isSubmitSuccessful'> & { isPending: boolean },
) {
  function getFeedbackEvaluation(question: SingleChoice): ChoiceFeedbackEvaluation<SingleChoice['type']>
  function getFeedbackEvaluation(question: MultipleChoice): ChoiceFeedbackEvaluation<MultipleChoice['type']>
  function getFeedbackEvaluation(question: OpenQuestion): FeedbackEvaluation<OpenQuestion['type']>
  function getFeedbackEvaluation(question: DragDropQuestion): FeedbackEvaluation<DragDropQuestion['type']>
  function getFeedbackEvaluation(question: Question): PracticeFeedbackReturn {
    const isEvaluated = isSubmitted && isSubmitSuccessful && (!isSubmitting || !isPending) && state.values?.question_id === question.id

    switch (question.type) {
      case 'single-choice': {
        const submittedAnswers = state.values?.type === question.type ? state.values : undefined
        const feedback = state.feedback?.type === question.type ? state.feedback : undefined

        const isCorrectlySelected = (answer: ChoiceQuestion['answers'][number]) => isEvaluated && submittedAnswers?.selection === feedback?.solution && submittedAnswers?.selection === answer.id
        const isMissingSelection = (answer: ChoiceQuestion['answers'][number]) => isEvaluated && feedback?.solution === answer.id && feedback.solution !== submittedAnswers?.selection
        const isFalslySelected = (answer: ChoiceQuestion['answers'][number]) => isEvaluated && submittedAnswers?.selection !== feedback?.solution && submittedAnswers?.selection === answer.id

        return {
          feedback: feedback,
          submittedAnswers: submittedAnswers,
          type: question.type,
          isCorrectlySelected,
          isMissingSelection,
          isFalslySelected,
        }
      }

      case 'multiple-choice': {
        const submittedAnswers = state.values?.type === question.type ? state.values : undefined
        const feedback = state.feedback?.type === question.type ? state.feedback : undefined

        const isCorrectlySelected = (answer: ChoiceQuestion['answers'][number]) =>
          isEvaluated && !!submittedAnswers?.selection.find((s) => s === answer.id) && !!feedback?.solution.find((s) => s === answer.id)

        const isMissingSelection = (answer: ChoiceQuestion['answers'][number]) =>
          isEvaluated && !submittedAnswers?.selection.find((s) => s === answer.id) && !!feedback?.solution.find((s) => s === answer.id)

        const isFalslySelected = (answer: ChoiceQuestion['answers'][number]) =>
          isEvaluated && !!submittedAnswers?.selection.find((s) => s === answer.id) && !feedback?.solution.find((s) => s === answer.id)

        return {
          feedback,
          submittedAnswers,
          type: question.type,
          isCorrectlySelected,
          isMissingSelection,
          isFalslySelected,
        }
      }

      // todo evaluate open- and drag-drop questions
      case 'open-question': {
        const submittedAnswers = state.values?.type === question.type ? state.values : undefined
        const feedback = state.feedback?.type === question.type ? state.feedback : undefined

        console.error(`Feedback evaluation not available for ${question.type}`)

        return {
          type: question.type,
          feedback,
          submittedAnswers,
        }
      }

      case 'drag-drop': {
        const submittedAnswers = state.values?.type === question.type ? state.values : undefined
        const feedback = state.feedback?.type === question.type ? state.feedback : undefined

        console.error(`Feedback evaluation not available for ${question.type}`)

        return {
          type: question.type,
          feedback,
          submittedAnswers,
        }
      }
    }
  }

  return getFeedbackEvaluation
}
