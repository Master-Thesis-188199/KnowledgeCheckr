import { createStore } from 'zustand/vanilla'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'

export type CreateCheckState = KnowledgeCheck

export type CreateCheckActions = {
  addQuestion: (question: Question) => void
}

export type CreateCheckStore = CreateCheckState & CreateCheckActions

export const createCheckCreateStore = (initialState: CreateCheckState = {} as CreateCheckState) => {
  return createStore<CreateCheckStore>()((set) => ({
    ...initialState,
    addQuestion: (question: Question) => set(() => ({ questions: [...initialState.questions, question] })),
  }))
}
