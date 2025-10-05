import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'
import { createZustandStore as createCacheStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'
import { isEqual } from 'lodash'
import { v4 as uuid } from 'uuid'

export type CheckState = KnowledgeCheck & {
  unsavedChanges?: boolean
}

export type CheckActions = {
  setName: (name: string) => void
  setDescription: (description: string) => void
  addQuestion: (question: Question) => void
  removeQuestion: (questionId: Question['id']) => void
}

export type CheckStore = CheckState & CheckActions

const defaultInitState: CheckState = {
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
  difficulty: 4,
  openDate: new Date(Date.now()),
  share_key: null,

  unsavedChanges: false,
}

export const createCheckStore: WithCaching<ZustandStore<CheckStore>> = ({ initialState = defaultInitState, options }) =>
  createCacheStore<CheckStore>({
    caching: true,
    options: { cacheKey: options?.cacheKey ?? 'check-store' },
    initializer: (set, get) => {
      const removeQuestion: CheckActions['removeQuestion'] = (questionId) =>
        set((prev) => {
          const toRemoveQuestion = prev.questions.find((question) => question.id === questionId)

          const category = toRemoveQuestion?.category
          const isCategoryUsed = prev.questions.filter((question) => question.id !== questionId).some((question) => question.category === category)

          return {
            questions: prev.questions.filter((question) => question.id !== questionId),
            questionCategories: isCategoryUsed ? prev.questionCategories : prev.questionCategories.filter((cat) => cat.name !== category),
            unsavedChanges: true,
          }
        })

      return {
        ...initialState,
        setName: (name) => set((prev) => ({ ...prev, name, unsavedChanges: true })),
        setDescription: (description) => set((prev) => ({ ...prev, description, unsavedChanges: true })),
        addQuestion: (question: Question) =>
          set((prev) => {
            const { questionCategories } = prev

            // Check if question already exists and has changed
            const exists = prev.questions.find((q) => q.id === question.id)
            if (exists && !isEqual(exists, question)) {
              console.log('Removing existing question to update it...')
              removeQuestion(question.id)
            } else if (exists && isEqual(exists, question)) {
              console.log('Question already exists and is unchanged, skipping...')
              return prev // No changes needed
            }

            // Add new category if not part of check-categories
            if (!questionCategories.find((category) => category.name === question.category)) {
              questionCategories.push({
                id: uuid(),
                name: question.category,
                skipOnMissingPrequisite: false,
              })
            }

            return { questions: [...prev.questions.filter((q) => question.id !== q.id), question], questionCategories, unsavedChanges: true }
          }),
        removeQuestion,
      }
    },
  })
