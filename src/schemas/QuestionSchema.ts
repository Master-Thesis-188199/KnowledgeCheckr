import { schemaUtilities } from '@/schemas/utils/schemaUtilities'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'
import { z } from 'zod'

const baseQuestion = z.object({
  id: z.string().default(Math.floor(Math.random() * 1000).toString()),
  points: z
    .number()
    .positive()
    .default((Math.floor(Math.random() * 1000) % 10) + 1),
  category: z.string().default('general'),

  question: z
    .string()
    .refine((q) => q.split(' ').length > 2, 'Please reformulate your question to be at least 3 words long.')
    .default(
      lorem
        .substring(0, Math.floor(Math.random() * 100) + 20)
        .split('\n')
        .join(''),
    ),
})

const questionAnswerTypes = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('single-choice'),
    answers: z
      .array(z.object({ answer: z.string(), correct: z.boolean() }))
      .min(1, 'Please provide at least one answer')
      .refine((answers) => answers.filter((answer) => answer.correct).length === 1, { message: 'A single-choice question must have *one* correct answer!' })
      .refine((answers) => answers.length === new Set(answers.map((answer) => answer.answer)).size, { message: 'Answers must be unique, meaning that answers must be distinct!' })
      .default([
        { answer: 'Answer 1', correct: false },
        { answer: 'Answer 2', correct: true },
        { answer: 'Answer 3', correct: false },
        { answer: 'Answer 4', correct: false },
      ]),
  }),

  z.object({
    type: z.literal('multiple-choice'),
    answers: z
      .array(z.object({ answer: z.string().min(1, 'An answer must not be empty!'), correct: z.boolean() }))
      .min(1, 'Please provide at least one answer')
      .refine((answers) => answers.find((answer) => answer.correct), { message: 'At least one answer has to be correct!' })
      .refine((answers) => answers.length === new Set(answers.map((answer) => answer.answer)).size, { message: 'Answers must be unique, meaning that answers must be distinct!' })
      .default([
        { answer: 'Answer 1', correct: false },
        { answer: 'Answer 2', correct: true },
        { answer: 'Answer 3', correct: false },
        { answer: 'Answer 4', correct: false },
      ]),
  }),

  z.object({
    type: z.literal('drag-drop'),
    answers: z
      .array(z.object({ answer: z.string(), position: z.number().positive() }))
      .default([
        { answer: 'Answer 1', position: 1 },
        { answer: 'Answer 2', position: 2 },
        { answer: 'Answer 3', position: 3 },
        { answer: 'Answer 4', position: 4 },
      ])
      .refine((answers) => answers.length === new Set(answers.map((answer) => answer.answer)).size, { message: 'Answers must be unique, meaning thaqt answers must be distinct!' }),
  }),

  z.object({ type: z.literal('open-question'), expectation: z.string().optional() }),
])

export const QuestionSchema = z.intersection(baseQuestion, questionAnswerTypes)

export type Question = z.infer<typeof QuestionSchema>

const { validate: validateQuestion, instantiate: instantiateQuestion, safeParse: safeParseQuestion } = schemaUtilities<Question>(QuestionSchema)
export { validateQuestion, instantiateQuestion, safeParseQuestion }

export type ChoiceQuestion = Extract<Question, { type: 'single-choice' | 'multiple-choice' }>
const { validate: validateChoiceQuestion, instantiate: instantiateChoiceQuestion, safeParse: safeParseChoiceQuestion } = schemaUtilities<ChoiceQuestion>(QuestionSchema)
export { validateChoiceQuestion, instantiateChoiceQuestion, safeParseChoiceQuestion }

export type OpenQuestion = Extract<Question, { type: 'open-question' }>
const { validate: validateOpenQuestion, instantiate: instantiateOpenQuestion, safeParse: safeParseOpenQuestion } = schemaUtilities<OpenQuestion>(QuestionSchema)
export { validateOpenQuestion, instantiateOpenQuestion, safeParseOpenQuestion }

export type DragDropQuestion = Extract<Question, { type: 'drag-drop' }>
const { validate: validateDragDropQuestion, instantiate: instantiateDragDropQuestion, safeParse: safeParseDragDropQuestion } = schemaUtilities<DragDropQuestion>(QuestionSchema)
export { validateDragDropQuestion, instantiateDragDropQuestion, safeParseDragDropQuestion }
