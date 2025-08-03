import useCacheStoreUpdate from '@/src/hooks/Shared/useCacheStoreUpdate'
import { ExaminationSchema, instantiateExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { instantiateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'
import { createStore } from 'zustand/vanilla'

export type ExaminationState = ExaminationSchema & {
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
  ...instantiateExaminationSchema(),
  knowledgeCheck: instantiateKnowledgeCheck(),
  startedAt: new Date(Date.now()),
  currentQuestionIndex: 0,
  isLastQuestion: false,
}

export const createExaminationStore = (initialState: ExaminationState = defaultInitState) => {
  return createStore<ExaminationStore>()((set) => {
    const { modify: modifyState } = useCacheStoreUpdate(set)

    return {
      ...initialState,
      // isLastQuestion: set((prev) => ({ ...prev, isLastQuestion: prev.currentQuestionIndex + 1 === prev.knowledgeCheck.questions.length })),
      setCurrentQuestionIndex: (index) => modifyState((prev) => ({ ...prev, currentQuestionIndex: index, isLastQuestion: index === prev.knowledgeCheck.questions.length })),
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
      saveQuestion: (question) => {
        return modifyState((prev) => ({
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
