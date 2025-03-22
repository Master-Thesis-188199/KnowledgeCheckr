import { z } from 'zod'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'
import { schemaUtilities } from '@/schemas/utils/schemaUtilities'

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
      .refine((answers) => answers.length === new Set(answers.map((answer) => answer.answer)).size, { message: 'Answers to a question must be unique (no duplication)!' })
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
      .array(z.object({ answer: z.string(), correct: z.boolean() }))
      .min(1, 'Please provide at least one answer')
      .refine((answers) => !answers.some((answer) => answer.correct), { message: 'At least one answer has been correct.' })
      .refine((answers) => answers.length === new Set(answers.map((answer) => answer.answer)).size, { message: 'Answers to a question must be unique (no duplication)!' })
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
      .refine((answers) => answers.length === new Set(answers.map((answer) => answer.answer)).size, { message: 'Answers to a question must be unique (no duplication)!' }),
  }),

  z.object({ type: z.literal('open-question'), expectation: z.string().optional() }),
])

export const QuestionSchema = z.intersection(baseQuestion, questionAnswerTypes)

export type Question = z.infer<typeof QuestionSchema>

const { validate: validateQuestion, instantiate: instantiateQuestion, safeParse: safeParseQuestion } = schemaUtilities<Question>(QuestionSchema)
export { validateQuestion, instantiateQuestion, safeParseQuestion }
