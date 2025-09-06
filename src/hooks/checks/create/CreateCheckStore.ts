import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { CreateStoreType } from '@/types/Shared/CreateStoreType'
import { isEqual } from 'lodash'
import { v4 as uuid } from 'uuid'
import { createStore } from 'zustand/vanilla'

export type CreateCheckState = KnowledgeCheck & {
  unsavedChanges?: boolean
}

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
  difficulty: 4,
  openDate: new Date(Date.now()),
  share_key: null,

  unsavedChanges: false,
}

export const createCheckCreateStore: CreateStoreType<CreateCheckState> = (initialState = defaultInitState, options) => {
  return createStore<CreateCheckStore>()((set) => {
    const { storeSessionValue } = useSessionStorageContext()

    const sessionStorageDebounceTime = 750
    let storeTimer: ReturnType<typeof setTimeout> | null = null

    function modifyState(func: (prev: CreateCheckStore) => CreateCheckStore | Partial<CreateCheckStore>) {
      set((prev) => {
        if (storeTimer) {
          clearTimeout(storeTimer)
        }

        const update = { ...prev, ...func(prev), unsavedChanges: true }

        storeTimer = setTimeout(() => {
          if (!options?.disableCache) storeSessionValue('create-check-store', update)
        }, sessionStorageDebounceTime)

        return update
      })
    }

    const removeQuestion: CreateCheckActions['removeQuestion'] = (questionId) =>
      modifyState((prev) => {
        const toRemoveQuestion = prev.questions.find((question) => question.id === questionId)

        const category = toRemoveQuestion?.category
        const isCategoryUsed = prev.questions.filter((question) => question.id !== questionId).some((question) => question.category === category)

        return {
          questions: prev.questions.filter((question) => question.id !== questionId),
          questionCategories: isCategoryUsed ? prev.questionCategories : prev.questionCategories.filter((cat) => cat.name !== category),
        }
      })

    return {
      ...initialState,
      setName: (name) => modifyState((prev) => ({ ...prev, name })),
      setDescription: (description) => modifyState((prev) => ({ ...prev, description })),
      addQuestion: (question: Question) =>
        modifyState((prev) => {
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

          return { questions: [...prev.questions.filter((q) => question.id !== q.id), question], questionCategories }
        }),
      removeQuestion,
    }
  })
}
