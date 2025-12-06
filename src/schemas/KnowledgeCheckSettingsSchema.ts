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
})

export type KnowledgeCheckSettings = z.infer<typeof KnowledgeCheckSettingsSchema>

const {
  validate: validateKnowledgeCheckSettings,
  instantiate: instantiateKnowledgeCheckSettings,
  safeParse: safeParseKnowledgeCheckSettings,
} = schemaUtilities<KnowledgeCheckSettings>(KnowledgeCheckSettingsSchema)
export { instantiateKnowledgeCheckSettings, safeParseKnowledgeCheckSettings, validateKnowledgeCheckSettings }
