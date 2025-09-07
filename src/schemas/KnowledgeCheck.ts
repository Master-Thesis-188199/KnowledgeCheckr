import { schemaUtilities } from '@/schemas/utils/schemaUtilities'
import { CategorySchema } from '@/src/schemas/CategorySchema'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { QuestionSchema } from '@/src/schemas/QuestionSchema'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'
import { z } from 'zod'

export const KnowledgeCheckSchema = z
  .object({
    id: z.string().default(Math.floor(Math.random() * 1000).toString()),

    name: z.string().default('Knowledge Check'),

    description: z
      .string()
      .nullable()
      .default(lorem.substring(0, Math.floor(Math.random() * 100))),

    difficulty: z
      .number()
      .min(1, 'Please specify a difficulty between 1 and 10.')
      .max(10, 'Please specify a difficulty between 1 and 10.')
      .optional()
      .default((Math.floor(Math.random() * 1000) % 10) + 1),

    questions: z.array(QuestionSchema),
    questionCategories: z
      .array(CategorySchema)
      .optional()
      .default([{ id: 'default', name: 'general' }]),

    share_key: z.string().nullable(),

    openDate: z
      .date()
      .or(z.string())
      .transform((date) => (typeof date === 'string' ? new Date(date) : date))
      .refine((check) => !isNaN(check.getTime()), 'Invalid date value provided')
      .default(new Date(Date.now())),

    closeDate: z
      .date()
      .or(z.string())
      .transform((date) => (typeof date === 'string' ? new Date(date) : date))
      .refine((check) => !isNaN(check.getTime()), 'Invalid date value provided')
      .nullable(),

    createdAt: StringDate.default(new Date(Date.now())).optional(),
    updatedAt: StringDate.default(new Date(Date.now())).optional(),
    owner_id: z.string().optional(),

    /* todo:
      - question-order: 'shuffle, static, ...'
      - question-answer-type: 'drag-drop', 'select', ....

    */
  })
  .refine(({ questions, questionCategories }) => questions.every((question) => !!questionCategories.find((qc) => qc.name === question.category)), {
    message: 'Please define question categories before assigning them to questions.',
  })

export type KnowledgeCheck = z.infer<typeof KnowledgeCheckSchema>

const { validate: validateKnowledgeCheck, instantiate: instantiateKnowledgeCheck, safeParse: safeParseKnowledgeCheck } = schemaUtilities<KnowledgeCheck>(KnowledgeCheckSchema)
export { instantiateKnowledgeCheck, safeParseKnowledgeCheck, validateKnowledgeCheck }
