import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'
import { v4 as uuid } from 'uuid'
import { createStore } from 'zustand/vanilla'

export type CreateCheckState = KnowledgeCheck

export type CreateCheckActions = {
  setName: (name: string) => void
  setDescription: (description: string) => void
  addQuestion: (question: Question) => void
  removeQuestion: (questionId: Question['id']) => void
}

export type CreateCheckStore = CreateCheckState & CreateCheckActions

const defaultInitState: CreateCheckState = {
  id: uuid(),
  name: '',
  questions: [],
  description: '',
  questionCategories: [
    {
      id: uuid(),
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
    setName: (name) => set((prev) => ({ ...prev, name })),
    setDescription: (description) => set((prev) => ({ ...prev, description })),
    addQuestion: (question: Question) =>
      set((prev) => {
        const { questionCategories } = prev

        // Add new category if not part of check-categories
        if (!questionCategories.find((category) => category.name === question.category)) {
          questionCategories.push({
            id: uuid(),
            name: question.category,
            skipOnMissingPrequisite: false,
          })
        }

        return { questions: [...prev.questions, question], questionCategories }
      }),
    removeQuestion: (questionId) =>
      set((prev) => {
        const toRemoveQuestion = prev.questions.find((question) => question.id !== questionId)

        const category = toRemoveQuestion?.category
        const isCategoryUsed = prev.questions.filter((question) => question.id !== questionId).some((question) => question.category === category)

        return {
          questions: prev.questions.filter((question) => question.id !== questionId),
          questionCategories: isCategoryUsed ? prev.questionCategories : prev.questionCategories.filter((cat) => cat.name !== category),
        }
      }),
  }))
}
