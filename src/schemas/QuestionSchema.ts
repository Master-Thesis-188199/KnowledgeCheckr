import { z } from 'zod'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'

export const QuestionSchema = z.object({
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

  answers: z
    .array(
      z.object({
        text: z.string(),
        correctAnswer: z.boolean().default(false),
      }),
    )
    .min(1, 'Please provide at least one answer')
    .refine((answers) => !answers.some((answer) => answer.correctAnswer), { message: 'At least one answer has been correct.' })
    .default([
      { text: 'Answer 1', correctAnswer: false },
      { text: 'Answer 2', correctAnswer: true },
      { text: 'Answer 3', correctAnswer: false },
      { text: 'Answer 4', correctAnswer: false },
    ]),
})

export type QuestionSchema = z.infer<typeof QuestionSchema>
