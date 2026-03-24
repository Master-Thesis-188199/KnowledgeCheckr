import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { getCourseSchema } from '@/src/schemas/CourseSchema'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { getQuestionInputSchema } from '@/src/schemas/UserQuestionInputSchema'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'
import { stripEffects } from '@/src/schemas/utils/stripEffects'

export function getExaminationSchema(t: Translator) {
  return z.object({
    course: stripEffects(getCourseSchema(t)),
    startedAt: StringDate.default(new Date(Date.now())),
    finishedAt: StringDate.nullable().default(null),
    score: z.number().default(0),
    results: z.array(getQuestionInputSchema(t)).default([]),
  })
}

export type ExaminationSchema = z.output<ReturnType<typeof getExaminationSchema>>

const { validate: validateExaminationSchema, instantiate: instantiateExaminationSchema, safeParse: safeParseExaminationSchema } = localizedSchemaUtilities(getExaminationSchema)
export { instantiateExaminationSchema, safeParseExaminationSchema, validateExaminationSchema }
