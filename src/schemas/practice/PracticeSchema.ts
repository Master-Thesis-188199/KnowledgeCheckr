import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { getCourseSchema } from '@/src/schemas/CourseSchema'
import { getStringDate } from '@/src/schemas/CustomZodTypes'
import { getQuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'
import { stripZodDefault } from '@/src/schemas/utils/stripZodDefaultValues'

export function getPracticeSchema(translator: Translator) {
  const courseSchema = getCourseSchema(translator)
  const pureCourseSchema = stripZodDefault(stripEffects(courseSchema))

  return z.object({
    courseId: pureCourseSchema.shape.id,
    startedAt: getStringDate(translator),
    score: z.number().default(0),
    questions: pureCourseSchema.shape.questions.default([]),
    results: z.array(getQuestionInputSchema(translator)).default([]),
  })
}

export type PracticeData = z.output<ReturnType<typeof getPracticeSchema>>

const { validate: validatePracticeData, instantiate: instantiatePracticeData, safeParse: safeParsePracticeData } = localizedSchemaUtilities(getPracticeSchema)
export { instantiatePracticeData, safeParsePracticeData, validatePracticeData }
