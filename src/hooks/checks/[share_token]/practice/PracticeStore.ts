import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'
import { Question } from '@/src/schemas/QuestionSchema'
import { ZustandStore } from '@/types/Shared/ZustandStore'

export type PracticeState = {
  unfilteredQuestions: Question[]
  practiceQuestions: Question[]
  currentQuestionIndex: number
  answers: Array<{ questionId: Question['id'] } & PracticeData>
}

export type PracticeActions = {
  /**
   * When this function is called will increase the `currentQuestionIndex` by one until the last question is displayed. When looping is enabled, calling this function when the last element is selected, will start over from the beginning.
   * @param looping Enables the infinite looping, thus resetting the `currentQuestionIndex` back to 0 when the last element is selected and the function called again.
   */
  nextQuestion: (looping?: boolean) => void
  /**
   * When this function is called will decrease the `currentQuestionIndex` by one until the first question is displayed. When looping is enabled, calling this function when the first element is selected, will start over from the last index.
   * @param looping Enables the infinite looping, thus resetting the `currentQuestionIndex` back to the length of the questions-array when the first element is selected and the function called again.
   */
  previousQuestion: (looping?: boolean) => void
  navigateToQuestion: (index: number) => void
  getQuestion: () => Question | null
  storeAnswer: (question: PracticeState['answers'][number]) => void
  updatePracticeQuestions: (questions: Question[]) => void
}

export type PracticeStore = PracticeState & PracticeActions

const defaultInitState: PracticeState = {
  practiceQuestions: [],
  unfilteredQuestions: [],
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

        getQuestion: () => get().practiceQuestions.at(get().currentQuestionIndex) ?? null,
        nextQuestion: (looping) =>
          set((prev) => {
            let newIndex = prev.currentQuestionIndex

            if (prev.practiceQuestions.length > prev.currentQuestionIndex + 1) newIndex += 1
            else if (prev.currentQuestionIndex + 1 >= prev.practiceQuestions.length && looping === true) newIndex = 0

            return { currentQuestionIndex: newIndex }
          }),

        previousQuestion: (looping) =>
          set((prev) => ({ currentQuestionIndex: prev.currentQuestionIndex > 0 ? prev.currentQuestionIndex - 1 : looping ? prev.practiceQuestions.length - 1 : prev.currentQuestionIndex })),
        navigateToQuestion: (index) => set((prev) => ({ currentQuestionIndex: index < prev.practiceQuestions.length && index >= 0 ? index : prev.currentQuestionIndex })),
        storeAnswer: (question) =>
          set((prev) => {
            const exists = prev.answers.find((r) => r.questionId === question.questionId)

            return { ...prev, answers: exists ? prev.answers.map((r) => (r.questionId === question.questionId ? question : r)) : prev.answers.concat([question]) }
          }),
        updatePracticeQuestions: (questions) => set((prev) => ({ ...prev, practiceQuestions: questions })),
      }
    },
  })

export const defaultPracticeStoreProps = defaultInitState
