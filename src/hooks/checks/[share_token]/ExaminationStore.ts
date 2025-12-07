import isEmpty from 'lodash/isEmpty'
import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { initializeExaminationResults } from '@/src/lib/checks/[share_token]/prepareExminationCheck'
import { ExaminationSchema, instantiateExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

export type ExaminationState = ExaminationSchema & {
  currentQuestionIndex: number
  isLastQuestion: boolean
}

export type ExaminationActions = {
  setCurrentQuestionIndex: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  saveAnswer: (result: ExaminationSchema['results'][number]) => void
  /**
   * By calling this function the forcefully updated, to trigger a caching of the state (including the `startedAt` timestamp)
   */
  startExamination: () => void
}

export type ExaminationStore = ExaminationState & ExaminationActions

const defaultInitState: ExaminationState = {
  ...instantiateExaminationSchema(),
  knowledgeCheck: instantiateKnowledgeCheck(),
  startedAt: new Date(Date.now()),
  currentQuestionIndex: 0,
  isLastQuestion: false,
}

export const createExaminationStore: WithCaching<ZustandStore<ExaminationStore>> = ({ initialState = defaultInitState, options }) =>
  createZustandStore({
    caching: true,
    options,
    initializer: (set) => {
      return {
        ...initialState,

        results: isEmpty(initialState.results) ? initializeExaminationResults(initialState) : initialState.results,

        // isLastQuestion: set((prev) => ({ ...prev, isLastQuestion: prev.currentQuestionIndex + 1 === prev.knowledgeCheck.questions.length })),
        setCurrentQuestionIndex: (index) => set((prev) => ({ ...prev, currentQuestionIndex: index, isLastQuestion: index === prev.knowledgeCheck.questions.length - 1 })),
        nextQuestion: () =>
          set((prev) => ({
            ...prev,
            currentQuestionIndex: (prev.currentQuestionIndex + 1) % prev.knowledgeCheck.questions.length,
            isLastQuestion: prev.currentQuestionIndex + 1 + 1 === prev.knowledgeCheck.questions.length,
          })),
        previousQuestion: () =>
          set((prev) => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex === 0 ? prev.knowledgeCheck.questions.length - 1 : prev.currentQuestionIndex - 1,
            isLastQuestion: (prev.currentQuestionIndex === 0 ? prev.knowledgeCheck.questions.length - 1 : prev.currentQuestionIndex - 1) + 1 === prev.knowledgeCheck.questions.length,
          })),
        saveAnswer: (result: ExaminationSchema['results'][number]) => {
          return set((prev) => ({
            ...prev,
            results: prev.results.find((r) => r.question_id === result.question_id) ? prev.results.map((r) => (r.question_id === result.question_id ? result : r)) : [...prev.results, result],
          }))
        },

        /**
         * By calling this function the forcefully updated, to trigger a caching of the state (including the `startedAt` timestamp)
         */
        startExamination: () => set((prev) => prev),
      }
    },
  })

export const defaultExaminationStoreProps = defaultInitState
