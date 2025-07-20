import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { createStore } from 'zustand/vanilla'

export type ExaminationState = {
  knowledgeCheck: KnowledgeCheck
  currentQuestionIndex: number
}

export type ExaminationActions = {
  setCurrentQuestionIndex: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
}

export type ExaminationStore = ExaminationState & ExaminationActions

const defaultInitState: ExaminationState = {
  currentQuestionIndex: 0,
  knowledgeCheck: instantiateKnowledgeCheck(),
}

export const createExaminationStore = (initialState: ExaminationState = defaultInitState) => {
  return createStore<ExaminationStore>()((set) => {
    return {
      ...initialState,
      setCurrentQuestionIndex: (index) => set((prev) => ({ ...prev, currentQuestionIndex: index })),
      nextQuestion: () => set((prev) => ({ ...prev, currentQuestionIndex: (prev.currentQuestionIndex + 1) % prev.knowledgeCheck.questions.length })),
      previousQuestion: () =>
        set((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex === 0 ? prev.knowledgeCheck.questions.length - 1 : prev.currentQuestionIndex - 1,
        })),
    }
  })
}
