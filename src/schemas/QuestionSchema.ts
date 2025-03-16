import { z } from 'zod'

export const QuestionSchema = z.object({
  id: z.string(),
  points: z.number().positive(),
  category: z.string().default('general'),

  question: z.string().refine((q) => q.split(' ').length > 2, 'Please reformulate your question to be at least 3 words long.'),
  answers: z
    .array(
      z.object({
        text: z.string(),
        correctAnswer: z.boolean().default(false),
      }),
    )
    .min(1, 'Please provide at least one answer')
    .refine((answers) => !answers.some((answer) => answer.correctAnswer), { message: 'At least one answer has been correct.' }),
})

export type QuestionSchema = z.infer<typeof QuestionSchema>
