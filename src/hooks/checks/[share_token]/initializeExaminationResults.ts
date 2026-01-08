'use client'

import { ExaminationState } from '@/src/hooks/checks/[share_token]/ExaminationStore'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { ChoiceQuestion } from '@/src/schemas/QuestionSchema'

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
