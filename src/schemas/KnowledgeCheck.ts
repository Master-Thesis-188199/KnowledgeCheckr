import { z } from 'zod'
import { QuestionSchema } from '@/src/schemas/QuestionSchema'
import { CategorySchema } from '@/src/schemas/CategorySchema'

const KnowledgeCheckSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    difficulty: z.number().min(1, 'Please specify a difficulty between 1 and 10.').max(10, 'Please specify a difficulty between 1 and 10.').optional(),

    questions: z.array(QuestionSchema),
    questionCategories: z
      .array(CategorySchema)
      .optional()
      .default([{ id: 'default', name: 'default' }]),

    share_key: z.string().nullable(),

    openDate: z.union([z.string(), z.date()]).transform((date) => (typeof date === 'string' ? new Date(Date.parse(date)).toLocaleString('de') : date.toLocaleString('de'))),
    closeDate: z
      .union([z.string(), z.date()])
      .transform((date) => (typeof date === 'string' ? new Date(Date.parse(date)).toLocaleString('de') : date.toLocaleString('de')))
      .nullable(),

    /* todo:
      - question-order: 'shuffle, static, ...'
      - question-answer-type: 'drag-drop', 'select', ....

    */
  })
  .refine(({ questions, questionCategories }) => questions.every((question) => !!questionCategories.find((qc) => qc.name === question.category)), {
    message: 'Please define question categories before assigning them to questions.',
  })

export type KnowledgeCheck = z.infer<typeof KnowledgeCheckSchema>
