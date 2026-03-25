import { addYears } from 'date-fns/addYears'
import { format } from 'date-fns/format'
import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

export const getCourseSettingsSchema = (t: Translator) =>
  z.object({
    id: z.uuidv4().default(() => getUUID()),

    practice: z.object({
      enablePracticing: z
        .boolean()
        .or(z.number())
        .transform((v) => !!v)
        .optional()
        .default(true)
        .describe(t('schemas.CourseSettings.practice.enablePracticing.description')),

      allowedPracticeCount: z
        .number()
        .min(1, t('schemas.CourseSettings.practice.allowedPracticeCount.min_constraint'))
        .nullable()
        .default(null)
        .describe(t('schemas.CourseSettings.practice.allowedPracticeCount.description')),
    }),

    examination: z.object({
      enableExaminations: z
        .boolean()
        .or(z.number())
        .transform((v) => !!v)
        .optional()
        .default(true)
        .describe(t('schemas.CourseSettings.examination.enableExaminations.description')),

      startDate: z
        .date()
        .or(z.string())
        .default(() => format(new Date(Date.now()), 'yyyy-MM-dd HH:mm:ss'))
        .transform((date) => (typeof date === 'string' ? new Date(date) : date))
        .refine((course) => !isNaN(course.getTime()), 'Invalid date value provided')
        .describe(t('schemas.CourseSettings.examination.startDate.description')),

      endDate: z
        .date()
        .or(z.string())
        .default(() => format(addYears(new Date(Date.now()), 1), 'yyyy-MM-dd 00:00:00'))
        .transform((date) => (typeof date === 'string' ? new Date(date) : date))
        .refine((course) => !isNaN(course.getTime()), 'Invalid date value provided')
        .nullable()
        .describe(t('schemas.CourseSettings.examination.endDate.description')),

      questionOrder: z.enum(['create-order', 'random']).default('random').describe(t('schemas.CourseSettings.examination.questionOrder.description')),
      answerOrder: z.enum(['create-order', 'random']).default('random').describe(t('schemas.CourseSettings.examination.answerOrder.description')),

      allowAnonymous: z
        .boolean()
        .or(z.number())
        .transform((v) => !!v)
        .default(true)
        .describe(t('schemas.CourseSettings.examination.allowAnonymous.description')),

      allowFreeNavigation: z
        .boolean()
        .or(z.number())
        .transform((v) => !!v)
        .default(true)
        .describe(t('schemas.CourseSettings.examination.allowFreeNavigation.description')),

      examTimeFrameSeconds: z
        .number()
        .min(60, t('schemas.CourseSettings.examination.examTimeFrameSeconds.min_constraint', { count: 1 }))
        .max(3600 * 5 + 1, t('schemas.CourseSettings.examination.examTimeFrameSeconds.max_constraint', { count: 5 }))
        .default(3600)
        .describe(t('schemas.CourseSettings.examination.examTimeFrameSeconds.description')),

      examinationAttemptCount: z
        .number()
        .min(1, t('schemas.CourseSettings.examination.examinationAttemptCount.min_constraint'))
        .default(1)
        .describe(t('schemas.CourseSettings.examination.examinationAttemptCount.description')),
    }),

    shareAccessibility: z
      .boolean()
      .or(z.number())
      .transform((v) => !!v)
      .optional()
      .default(false)
      .describe(t('schemas.CourseSettings.shareAccessibility.description')),
  })

export type CourseSettings = z.output<ReturnType<typeof getCourseSettingsSchema>>

const { validate: validateCourseSettings, instantiate: instantiateCourseSettings, safeParse: safeParseCourseSettings } = localizedSchemaUtilities(getCourseSettingsSchema)
export { instantiateCourseSettings, safeParseCourseSettings, validateCourseSettings }
