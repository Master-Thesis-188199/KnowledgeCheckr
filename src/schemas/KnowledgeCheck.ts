import { isBefore } from 'date-fns/isBefore'
import { z } from 'zod'
import { schemaUtilities } from '@/schemas/utils/schemaUtilities'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import { CategorySchema } from '@/src/schemas/CategorySchema'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { QuestionSchema } from '@/src/schemas/QuestionSchema'

export const KnowledgeCheckSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .default(() => getUUID()),

    name: z.string().default('Knowledge Check').describe('The name under which the created check is associated with.'),

    description: z
      .string()
      .nullable()
      .default(() => lorem().substring(0, Math.floor(Math.random() * 100)))
      .describe('Describe the concept of your knowledge check using a few words.'),

    difficulty: z
      .number()
      .min(1, 'Please specify a difficulty between 1 and 10.')
      .max(10, 'Please specify a difficulty between 1 and 10.')
      .optional()
      .default(() => (Math.floor(Math.random() * 1000) % 10) + 1)
      .describe('Defines the skill level needed for this check.'),

    questions: z.array(QuestionSchema).refine((questions) => questions.length === new Set(questions.map((q) => q.id)).size, { message: 'The ids of questions must be unique!' }),
    questionCategories: z
      .array(CategorySchema)
      .optional()
      .default(() => [{ id: getUUID(), name: 'general', skipOnMissingPrequisite: false }]),

    share_key: z.string().nullable().default(null),

    openDate: z
      .date()
      .or(z.string())
      .transform((date) => (typeof date === 'string' ? new Date(date) : date))
      .refine((check) => !isNaN(check.getTime()), 'Invalid date value provided')
      // .refine((date) => isFuture(addDays(date, 1)), 'The openDate cannot be in the past!')
      .default(() => new Date(Date.now()))
      .describe('The day on which users can start to use the check.'),
    closeDate: z
      .date()
      .or(z.string())
      .transform((date) => (typeof date === 'string' ? new Date(date) : date))
      .refine((check) => !isNaN(check.getTime()), 'Invalid date value provided')
      // .refine((date) => isFuture(addDays(date, 1)), 'The closeDate cannot be in the past!')
      .nullable()
      .default(null)
      .describe('The last day on which the check can be used by others.'),

    createdAt: StringDate.default(() => new Date(Date.now())).optional(),
    updatedAt: StringDate.default(() => new Date(Date.now())).optional(),
    owner_id: z.string().optional(),

    settings: KnowledgeCheckSettingsSchema,

    /* todo:
      - question-order: 'shuffle, static, ...'
      - question-answer-type: 'drag-drop', 'select', ....

    */
  })
  .refine(({ questions, questionCategories }) => questions.every((question) => !!questionCategories?.find((qc) => qc.name === question.category)), {
    message: 'Please define question categories before assigning them to questions.',
  })
  .superRefine(({ openDate, closeDate }, ctx) => {
    if (closeDate === null) return

    if (isBefore(closeDate, openDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'The closeDate cannot be before the start date',
        path: ['closeDate'],
      })
    }
  })

export type KnowledgeCheck = z.infer<typeof KnowledgeCheckSchema>

const { validate: validateKnowledgeCheck, instantiate: instantiateKnowledgeCheck, safeParse: safeParseKnowledgeCheck } = schemaUtilities<KnowledgeCheck>(KnowledgeCheckSchema)
export { instantiateKnowledgeCheck, safeParseKnowledgeCheck, validateKnowledgeCheck }
