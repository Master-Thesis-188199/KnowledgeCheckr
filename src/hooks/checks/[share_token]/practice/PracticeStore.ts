import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { Question } from '@/src/schemas/QuestionSchema'
import { ZustandStore } from '@/types/Shared/ZustandStore'

export type PracticeState = {
  questions: Question[]
  currentQuestionIndex: number
}

export type PracticeActions = {
  nextQuestion: () => void
  previousQuestion: () => void
  navigateToQuestion: (index: number) => void
  getQuestion: () => Question | null
}

export type PracticeStore = PracticeState & PracticeActions

const defaultInitState: PracticeState = {
  questions: [],
  currentQuestionIndex: 0,
}
export const createPracticeStore: ZustandStore<PracticeStore, Partial<PracticeState>> = ({ initialState = defaultInitState }) =>
  createZustandStore({
    caching: false,
    initializer: (set, get) => {
      return {
        ...defaultInitState,
        ...initialState,

        getQuestion: () => get().questions.at(get().currentQuestionIndex) ?? null,
        nextQuestion: () => set((prev) => ({ currentQuestionIndex: prev.questions.length > prev.currentQuestionIndex + 1 ? prev.currentQuestionIndex + 1 : prev.currentQuestionIndex })),
        previousQuestion: () => set((prev) => ({ currentQuestionIndex: prev.currentQuestionIndex > 0 ? prev.currentQuestionIndex - 1 : prev.currentQuestionIndex })),
        navigateToQuestion: (index) => set((prev) => ({ currentQuestionIndex: index + 1 < prev.questions.length && index >= 0 ? index : prev.currentQuestionIndex })),
      }
    },
  })

export const defaultPracticeStoreProps = defaultInitState
