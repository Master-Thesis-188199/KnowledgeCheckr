import isEqual from 'lodash/isEqual'
import { v4 as uuid } from 'uuid'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { Question } from '@/schemas/QuestionSchema'
import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

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
  createZustandStore({
    caching: true,
    options,
    initializer: (set) => {
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

            //* updates questions by replacing to-update question with new version
            const updatedQuestions = prev.questions.map((q) => (question.id !== q.id ? q : question))

            //* adds a new question to the end of the array
            if (!exists) updatedQuestions.push(question)

            return { questions: [...updatedQuestions], questionCategories, unsavedChanges: true }
          }),
        removeQuestion,
      }
    },
  })
