import { z } from 'zod'
import { CourseSchema } from '@/src/schemas/CourseSchema'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { QuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'

export const ExaminationSchema = z.object({
  knowledgeCheck: stripEffects(CourseSchema),
  startedAt: StringDate.default(new Date(Date.now())),
  finishedAt: StringDate.nullable().default(null),
  score: z.number().default(0),
  results: z.array(QuestionInputSchema).default([]),
})

export type ExaminationSchema = z.output<typeof ExaminationSchema>

const { validate: validateExaminationSchema, instantiate: instantiateExaminationSchema, safeParse: safeParseExaminationSchema } = schemaUtilities(ExaminationSchema)
export { instantiateExaminationSchema, safeParseExaminationSchema, validateExaminationSchema }
