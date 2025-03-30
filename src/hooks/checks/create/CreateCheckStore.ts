import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'
import { createStore } from 'zustand/vanilla'

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
    addQuestion: (question: Question) =>
      set((prev) => {
        const { questionCategories } = prev

        // Add new category if not part of check-categories
        if (!questionCategories.find((category) => category.name === question.category)) {
          questionCategories.push({
            id: crypto.randomUUID(),
            name: question.category,
            skipOnMissingPrequisite: false,
          })
        }

        return { questions: [...prev.questions, question], questionCategories }
      }),
  }))
}
