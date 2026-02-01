import { savePracticeResults } from '@/database/practice'
import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Question } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

export type PracticeState = {
  startedAt: Date
  checkId: KnowledgeCheck['id']
  unfilteredQuestions: Question[]
  practiceQuestions: Question[]
  currentQuestionIndex: number
  answerResults: Array<QuestionInput>
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
  storeAnswer: (question: PracticeState['answerResults'][number]) => void
  updatePracticeQuestions: (questions: Question[]) => void
}

export type PracticeStore = PracticeState & PracticeActions

const defaultInitState: PracticeState = {
  checkId: '',
  startedAt: new Date(Date.now()),
  practiceQuestions: [],
  unfilteredQuestions: [],
  currentQuestionIndex: 0,
  answerResults: [],
}
export const createPracticeStore: WithCaching<ZustandStore<PracticeStore, Partial<PracticeState>>> = ({ initialState = defaultInitState, options }) =>
  createZustandStore({
    caching: true,
    options,
    initializer: (set, get) => {
      return {
        ...defaultInitState,
        startedAt: new Date(Date.now()),
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
          set((prev) => {
            let newIndex = prev.currentQuestionIndex

            if (prev.currentQuestionIndex > 0) newIndex -= 1
            else if (prev.currentQuestionIndex === 0 && looping === true) newIndex = prev.practiceQuestions.length - 1

            return { currentQuestionIndex: newIndex }
          }),
        navigateToQuestion: (index) => set((prev) => ({ currentQuestionIndex: index < prev.practiceQuestions.length && index >= 0 ? index : prev.currentQuestionIndex })),
        storeAnswer: (question) =>
          set((prev) => {
            const exists = prev.answerResults.find((r) => r.question_id === question.question_id)

            const update: typeof prev = {
              ...prev,
              answerResults: exists ? prev.answerResults.map((r) => (r.question_id === question.question_id ? question : r)) : prev.answerResults.concat([question]),
            }
            savePracticeResults({ knowledgeCheckId: update.checkId, results: update.answerResults, startedAt: update.startedAt, score: 0 })

            return update
          }),
        updatePracticeQuestions: (questions) => set((prev) => ({ ...prev, practiceQuestions: questions })),
      }
    },
  })

export const defaultPracticeStoreProps = defaultInitState
