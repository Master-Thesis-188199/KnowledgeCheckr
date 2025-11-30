import { z } from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

export const KnowledgeCheckSettingsSchema = z.object({
  questionOrder: z.enum(['create-order', 'random']).default('random'),
  answerOrder: z.enum(['create-order', 'random']).default('random'),
})

export type KnowledgeCheckSettings = z.infer<typeof KnowledgeCheckSettingsSchema>

const {
  validate: validateKnowledgeCheckSettings,
  instantiate: instantiateKnowledgeCheckSettings,
  safeParse: safeParseKnowledgeCheckSettings,
} = schemaUtilities<KnowledgeCheckSettings>(KnowledgeCheckSettingsSchema)
export { instantiateKnowledgeCheckSettings, safeParseKnowledgeCheckSettings, validateKnowledgeCheckSettings }
