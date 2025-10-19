'use client'

import { AuthState, PracticeFeedback } from '@/src/lib/checks/[share_token]/practice/EvaluateAnswer'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import { ChoiceQuestion, Question } from '@/src/schemas/QuestionSchema'
import { Any } from '@/types'
import { FormState } from 'react-hook-form'

type EvaluationFunction = (...args: Any) => boolean

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
  const isEvaluated = isSubmitted && isSubmitSuccessful && (!isSubmitting || !isPending)

  const getFeedbackEvaluation = <T extends Question>(question: T) => {
    let isCorrectlySelected: EvaluationFunction = () => false,
      isMissingSelection: EvaluationFunction = () => false,
      isFalslySelected: EvaluationFunction = () => false

    const feedback = state.feedback?.type === question.type ? (state.feedback as Extract<PracticeFeedback, { type: T['type'] }>) : undefined
    const submittedAnswers = state.values?.type === question.type ? (state.values as Extract<PracticeData, { type: T['type'] }> | undefined) : undefined

    if (!isEvaluated || submittedAnswers?.question_id !== question.id) return { feedback: undefined, submittedAnswers: undefined, isCorrectlySelected, isMissingSelection, isFalslySelected }

    switch (question.type) {
      case 'single-choice': {
        const submission = submittedAnswers as Extract<PracticeData, { type: typeof question.type }> | undefined
        const evaluation = feedback as Extract<PracticeFeedback, { type: typeof question.type }> | undefined
        isCorrectlySelected = (answer: ChoiceQuestion['answers'][number]) => submission?.selection === evaluation?.solution && submission?.selection === answer.id
        isMissingSelection = (answer: ChoiceQuestion['answers'][number]) => evaluation?.solution === answer.id && evaluation.solution !== submission?.selection
        isFalslySelected = (answer: ChoiceQuestion['answers'][number]) => submission?.selection !== evaluation?.solution && submission?.selection === answer.id
        break
      }

      case 'multiple-choice': {
        const submission = submittedAnswers as Extract<PracticeData, { type: typeof question.type }> | undefined
        const evaluation = feedback as Extract<PracticeFeedback, { type: typeof question.type }> | undefined
        isCorrectlySelected = (answer: ChoiceQuestion['answers'][number]) => !!submission?.selection.find((s) => s === answer.id) && !!evaluation?.solution.find((s) => s === answer.id)
        isMissingSelection = (answer: ChoiceQuestion['answers'][number]) => !submission?.selection.find((s) => s === answer.id) && !!evaluation?.solution.find((s) => s === answer.id)
        isFalslySelected = (answer: ChoiceQuestion['answers'][number]) => !!submission?.selection.find((s) => s === answer.id) && !evaluation?.solution.find((s) => s === answer.id)
        break
      }

      // todo evaluate open- and drag-drop questions
      case 'open-question': {
        console.error(`Feedback evaluation not available for ${question.type}`)
        break
      }

      case 'drag-drop': {
        console.error(`Feedback evaluation not available for ${question.type}`)
        break
      }
    }

    return { feedback, submittedAnswers, isCorrectlySelected, isMissingSelection, isFalslySelected }
  }

  return getFeedbackEvaluation
}
