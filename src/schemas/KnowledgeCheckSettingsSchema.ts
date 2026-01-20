import { z } from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

export const KnowledgeCheckSettingsSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => getUUID()),

  questionOrder: z.enum(['create-order', 'random']).default('random').describe('Defines how questions are ordered during practice / exams.'),

  answerOrder: z.enum(['create-order', 'random']).default('random').describe('Defines how answers are ordered during practice / exams.'),

  allowAnonymous: z
    .boolean()
    .or(z.number())
    .transform((v) => !!v)
    .default(true)
    .describe('Specifies whether anonymous users can interact with this check.'),

  allowFreeNavigation: z
    .boolean()
    .or(z.number())
    .transform((v) => !!v)
    .default(true)
    .describe('Specifies whether users can switch between questions freely or not.'),

  examTimeFrameSeconds: z
    .number()
    .min(60, 'The examination time frame must be at least 1 minute!')
    .max(3600 * 5 + 1, 'The examination time frame cannot exceed more than 5 hours!')
    .default(3600)
    .describe('The max duration users have to finish their examination attempt.'),

  examinationAttemptCount: z.number().min(1, 'Users must be allowed to have at least one attempt.').default(1).describe('The amount of examination attempts users have.'),

  shareAccessibility: z
    .boolean()
    .or(z.number())
    .transform((v) => !!v)
    .optional()
    .default(false)
    .describe('Defines whether this check is publicly accessible, thus whether users can discover this check.'),
})

export type KnowledgeCheckSettings = z.infer<typeof KnowledgeCheckSettingsSchema>

const { validate: validateKnowledgeCheckSettings, instantiate: instantiateKnowledgeCheckSettings, safeParse: safeParseKnowledgeCheckSettings } = schemaUtilities(KnowledgeCheckSettingsSchema)
export { instantiateKnowledgeCheckSettings, safeParseKnowledgeCheckSettings, validateKnowledgeCheckSettings }
