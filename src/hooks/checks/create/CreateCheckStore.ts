import { createStore } from 'zustand/vanilla'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'

export type CreateCheckState = KnowledgeCheck

export type CreateCheckActions = {
  addQuestion: (question: Question) => void
}

export type CreateCheckStore = CreateCheckState & CreateCheckActions

const defaultInitState: CreateCheckState = {
  id: crypto.randomUUID(),
  name: '',
  questions: [],
  description: '',
  questionCategories: [
    {
      id: crypto.randomUUID(),
      name: 'general',
      skipOnMissingPrequisite: false,
    },
  ],

  closeDate: null,
  difficulty: 0,
  openDate: new Date(Date.now()).toLocaleDateString('de'),
  share_key: null,
}

export const createCheckCreateStore = (initialState: CreateCheckState = defaultInitState) => {
  return createStore<CreateCheckStore>()((set) => ({
    ...initialState,
    addQuestion: (question: Question) => set((prev) => ({ questions: [...prev.questions, question] })),
  }))
}
