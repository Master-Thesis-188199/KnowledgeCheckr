import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { instantiateCourse } from '@/src/schemas/CourseSchema'
import { ExaminationSchema, instantiateExaminationSchema } from '@/src/schemas/ExaminationSchema'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

export type ExaminationState = ExaminationSchema & {
  currentQuestionIndex: number
  isLastQuestion: boolean
}

export type ExaminationActions = {
  setCurrentQuestionIndex: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  saveAnswer: (result: ExaminationSchema['results'][number]) => void
  /**
   * By calling this function the state is forcefully updated, to trigger a caching of the state (including the `startedAt` timestamp)
   */
  startExamination: () => void
}

export type ExaminationStore = ExaminationState & ExaminationActions

export const createExaminationStore: WithCaching<ZustandStore<ExaminationStore, Partial<ExaminationState>>> = ({ initialState, options, translator }) => {
  const defaultInitState: ExaminationState = {
    ...instantiateExaminationSchema(translator),
    course: instantiateCourse(translator),
    startedAt: new Date(Date.now()),
    currentQuestionIndex: 0,
    isLastQuestion: false,
  }

  return createZustandStore({
    caching: true,
    options,
    initializer: (set) => {
      return {
        ...defaultInitState,
        ...initialState,

        // isLastQuestion: set((prev) => ({ ...prev, isLastQuestion: prev.currentQuestionIndex + 1 === prev.course.questions.length })),
        setCurrentQuestionIndex: (index) => set((prev) => ({ ...prev, currentQuestionIndex: index, isLastQuestion: index === prev.course.questions.length - 1 })),
        nextQuestion: () =>
          set((prev) => ({
            ...prev,
            currentQuestionIndex: (prev.currentQuestionIndex + 1) % prev.course.questions.length,
            isLastQuestion: prev.currentQuestionIndex + 1 + 1 === prev.course.questions.length,
          })),
        previousQuestion: () =>
          set((prev) => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex === 0 ? prev.course.questions.length - 1 : prev.currentQuestionIndex - 1,
            isLastQuestion: (prev.currentQuestionIndex === 0 ? prev.course.questions.length - 1 : prev.currentQuestionIndex - 1) + 1 === prev.course.questions.length,
          })),
        saveAnswer: (result) => {
          return set((prev) => ({
            ...prev,
            results: prev.results.find((r) => r.question_id === result.question_id) ? prev.results.map((r) => (r.question_id === result.question_id ? result : r)) : [...prev.results, result],
          }))
        },

        /**
         * By calling this function the state is forcefully updated, to trigger a caching of the state (including the `startedAt` timestamp)
         */
        startExamination: () => set((prev) => prev),
      }
    },
  })
}
