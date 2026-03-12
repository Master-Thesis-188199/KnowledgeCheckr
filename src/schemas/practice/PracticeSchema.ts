import { z } from 'zod'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { CourseSchema } from '@/src/schemas/KnowledgeCheck'
import { QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'
import { stripZodDefault } from '@/src/schemas/utils/stripZodDefaultValues'

export const PracticeSchema = z.object({
  courseId: stripZodDefault(stripEffects(CourseSchema)).shape.id,
  startedAt: StringDate,
  score: z.number().default(0),
  questions: stripZodDefault(stripEffects(CourseSchema)).shape.questions.default([]),
  results: z.array(QuestionInputSchema).default([]),
})

export type PracticeData = z.infer<typeof PracticeSchema>

const { validate: validatePracticeData, instantiate: instantiatePracticeData, safeParse: safeParsePracticeData } = schemaUtilities(PracticeSchema)
export { instantiatePracticeData, safeParsePracticeData, validatePracticeData }
