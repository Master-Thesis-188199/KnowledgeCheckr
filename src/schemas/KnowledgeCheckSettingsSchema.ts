import { z } from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

export const KnowledgeCheckSettingsSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => getUUID()),
  questionOrder: z.enum(['create-order', 'random']).default('random'),
  answerOrder: z.enum(['create-order', 'random']).default('random'),

  allowAnonymous: z
    .boolean()
    .or(z.number())
    .transform((v) => !!v)
    .default(true),
  allowFreeNavigation: z
    .boolean()
    .or(z.number())
    .transform((v) => !!v)
    .default(true),

  examTimeFrameSeconds: z
    .number()
    .min(60, 'The examination time frame must be at least 1 minute!')
    .max(3600 * 5 + 1, 'The examination time frame cannot exceed more than 5 hours!')
    .default(3600),
})

export type KnowledgeCheckSettings = z.infer<typeof KnowledgeCheckSettingsSchema>

const {
  validate: validateKnowledgeCheckSettings,
  instantiate: instantiateKnowledgeCheckSettings,
  safeParse: safeParseKnowledgeCheckSettings,
} = schemaUtilities<KnowledgeCheckSettings>(KnowledgeCheckSettingsSchema)
export { instantiateKnowledgeCheckSettings, safeParseKnowledgeCheckSettings, validateKnowledgeCheckSettings }
