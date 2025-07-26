import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'
import { createStore } from 'zustand/vanilla'

export type ExaminationState = {
  knowledgeCheck: KnowledgeCheck
  currentQuestionIndex: number
  isLastQuestion: boolean
}

export type ExaminationActions = {
  setCurrentQuestionIndex: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  saveQuestion: (question: Question) => void
}

export type ExaminationStore = ExaminationState & ExaminationActions

const defaultInitState: ExaminationState = {
  currentQuestionIndex: 0,
  knowledgeCheck: instantiateKnowledgeCheck(),
  isLastQuestion: false,
}

export const createExaminationStore = (initialState: ExaminationState = defaultInitState) => {
  return createStore<ExaminationStore>()((set) => {
    return {
      ...initialState,
      // isLastQuestion: set((prev) => ({ ...prev, isLastQuestion: prev.currentQuestionIndex + 1 === prev.knowledgeCheck.questions.length })),
      setCurrentQuestionIndex: (index) => set((prev) => ({ ...prev, currentQuestionIndex: index, isLastQuestion: index === prev.knowledgeCheck.questions.length })),
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
      saveQuestion: (question) => {
        return set((prev) => ({
          ...prev,
          knowledgeCheck: {
            ...prev.knowledgeCheck,
            questions: prev.knowledgeCheck.questions.map((q) => (q.id === question.id ? question : q)),
          },
        }))
      },
    }
  })
}

export const defaultExaminationStoreProps = defaultInitState
