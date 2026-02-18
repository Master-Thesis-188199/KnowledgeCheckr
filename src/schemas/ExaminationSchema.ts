import { z } from 'zod'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { KnowledgeCheckSchema } from '@/src/schemas/KnowledgeCheck'
import { QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'

export const ExaminationSchema = z.object({
  knowledgeCheck: stripEffects(KnowledgeCheckSchema),
  startedAt: StringDate.default(new Date(Date.now())),
  finishedAt: StringDate.nullable().default(null),
  score: z.number().default(0),
  results: z.array(QuestionInputSchema).default([]),
})

export type ExaminationSchema = z.infer<typeof ExaminationSchema>

const { validate: validateExaminationSchema, instantiate: instantiateExaminationSchema, safeParse: safeParseExaminationSchema } = schemaUtilities(ExaminationSchema)
export { instantiateExaminationSchema, safeParseExaminationSchema, validateExaminationSchema }
