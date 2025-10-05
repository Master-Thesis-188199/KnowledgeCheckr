import useCacheStoreUpdate from '@/src/hooks/Shared/useCacheStoreUpdate'
import { initializeExaminationResults } from '@/src/lib/checks/[share_token]/Examination'
import { ExaminationSchema, instantiateExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'
import _ from 'lodash'
import { createStore } from 'zustand/vanilla'

export type ExaminationState = ExaminationSchema & {
  currentQuestionIndex: number
  isLastQuestion: boolean
}

export type ExaminationActions = {
  setCurrentQuestionIndex: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  saveAnswer: (result: ExaminationSchema['results'][number]) => void
}

export type ExaminationStore = ExaminationState & ExaminationActions

const defaultInitState: ExaminationState = {
  ...instantiateExaminationSchema(),
  knowledgeCheck: instantiateKnowledgeCheck(),
  startedAt: new Date(Date.now()),
  currentQuestionIndex: 0,
  isLastQuestion: false,
}

export const createExaminationStore: WithCaching<ZustandStore<ExaminationStore>> = (initialState = defaultInitState, options) => {
  return createStore<ExaminationStore>()((set) => {
    const { modify: modifyState } = useCacheStoreUpdate(set, { options, cache_key: options?.cacheKey ?? 'examination-store' })

    return {
      ...initialState,

      results: _.isEmpty(initialState.results) ? initializeExaminationResults(initialState) : initialState.results,

      // isLastQuestion: set((prev) => ({ ...prev, isLastQuestion: prev.currentQuestionIndex + 1 === prev.knowledgeCheck.questions.length })),
      setCurrentQuestionIndex: (index) => modifyState((prev) => ({ ...prev, currentQuestionIndex: index, isLastQuestion: index === prev.knowledgeCheck.questions.length - 1 })),
      nextQuestion: () =>
        modifyState((prev) => ({
          ...prev,
          currentQuestionIndex: (prev.currentQuestionIndex + 1) % prev.knowledgeCheck.questions.length,
          isLastQuestion: prev.currentQuestionIndex + 1 + 1 === prev.knowledgeCheck.questions.length,
        })),
      previousQuestion: () =>
        modifyState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex === 0 ? prev.knowledgeCheck.questions.length - 1 : prev.currentQuestionIndex - 1,
          isLastQuestion: (prev.currentQuestionIndex === 0 ? prev.knowledgeCheck.questions.length - 1 : prev.currentQuestionIndex - 1) + 1 === prev.knowledgeCheck.questions.length,
        })),
      saveAnswer: (result: ExaminationSchema['results'][number]) => {
        return modifyState((prev) => ({
          ...prev,
          results: prev.results.find((r) => r.question_id === result.question_id) ? prev.results.map((r) => (r.question_id === result.question_id ? result : r)) : [...prev.results, result],
        }))
      },
    }
  })
}

export const defaultExaminationStoreProps = defaultInitState
