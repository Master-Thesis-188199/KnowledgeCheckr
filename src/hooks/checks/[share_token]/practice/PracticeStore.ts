import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import { Question } from '@/src/schemas/QuestionSchema'
import { ZustandStore } from '@/types/Shared/ZustandStore'

export type PracticeState = {
  questions: Question[]
  currentQuestionIndex: number
  answers: Array<{ questionId: Question['id'] } & PracticeData>
}

export type PracticeActions = {
  nextQuestion: () => void
  previousQuestion: () => void
  navigateToQuestion: (index: number) => void
  getQuestion: () => Question | null
  storeAnswer: (question: PracticeState['answers'][number]) => void
}

export type PracticeStore = PracticeState & PracticeActions

const defaultInitState: PracticeState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
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
        navigateToQuestion: (index) => set((prev) => ({ currentQuestionIndex: index < prev.questions.length && index >= 0 ? index : prev.currentQuestionIndex })),
        storeAnswer: (question) =>
          set((prev) => {
            const exists = prev.answers.find((r) => r.questionId === question.questionId)

            return { ...prev, answers: exists ? prev.answers.map((r) => (r.questionId === question.questionId ? question : r)) : prev.answers.concat([question]) }
          }),
      }
    },
  })

export const defaultPracticeStoreProps = defaultInitState
