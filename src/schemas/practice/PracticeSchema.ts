import { z } from 'zod'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { KnowledgeCheckSchema } from '@/src/schemas/KnowledgeCheck'
import { QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'
import { stripZodDefault } from '@/src/schemas/utils/stripZodDefaultValues'

export const PracticeSchema = z.object({
  checkId: stripZodDefault(stripEffects(KnowledgeCheckSchema)).shape.id,
  startedAt: StringDate,
  score: z.number().default(0),
  questions: stripZodDefault(stripEffects(KnowledgeCheckSchema)).shape.questions.default([]),
  results: z.array(QuestionInputSchema).default([]),
})

export type PracticeData = z.infer<typeof PracticeSchema>

const { validate: validatePracticeData, instantiate: instantiatePracticeData, safeParse: safeParsePracticeData } = schemaUtilities(PracticeSchema)
export { instantiatePracticeData, safeParsePracticeData, validatePracticeData }
