import { isBefore } from 'date-fns/isBefore'
import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import { getCategorySchema } from '@/src/schemas/CategorySchema'
import { getCourseContentSchema } from '@/src/schemas/CourseContentSchema'
import { getCourseSettingsSchema } from '@/src/schemas/CourseSettingsSchema'
import { getStringDate } from '@/src/schemas/CustomZodTypes'
import { getQuestionSchema } from '@/src/schemas/QuestionSchema'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

export function getCourseSchema(t: Translator) {
  return (
    z
      .object({
        id: z.uuidv4().default(() => getUUID()),

        name: z.string().default(t('schemas.Course.name.default')).describe(t('schemas.Course.name.description')),

        description: z
          .string()
          .nullable()
          .default(() => lorem().substring(0, Math.floor(Math.random() * 100)))
          .describe(t('schemas.Course.description.description')),

        contents: z.array(getCourseContentSchema(t)).default([]),

        difficulty: z
          .number()
          .min(1, t('schemas.Course.difficulty.min_max_message'))
          .max(10, t('schemas.Course.difficulty.min_max_message'))
          .optional()
          .default(() => (Math.floor(Math.random() * 1000) % 10) + 1)
          .describe(t('schemas.Course.difficulty.description')),

        questions: z.array(getQuestionSchema(t)).refine((questions) => questions.length === new Set(questions.map((q) => q.id)).size, { message: t('schemas.Course.questions.refinement_message') }),
        questionCategories: z
          .array(getCategorySchema(t))
          .optional()
          .default(() => [{ id: getUUID(), name: 'general', skipOnMissingPrequisite: false, prequisiteCategoryId: null }]),

        share_key: z.string().nullable().default(null),

        openDate: z
          .date()
          .or(z.string())
          .transform((date) => (typeof date === 'string' ? new Date(date) : date))
          .refine((course) => !isNaN(course.getTime()), t('schemas.Shared.date_nan_time'))
          // .refine((date) => isFuture(addDays(date, 1)), 'The openDate cannot be in the past!')
          .default(() => new Date(Date.now()))
          .describe(t('schemas.Course.openDate.description')),
        closeDate: z
          .date()
          .or(z.string())
          .transform((date) => (typeof date === 'string' ? new Date(date) : date))
          .refine((course) => !isNaN(course.getTime()), t('schemas.Shared.date_nan_time'))
          // .refine((date) => isFuture(addDays(date, 1)), 'The closeDate cannot be in the past!')
          .nullable()
          .default(null)
          .describe(t('schemas.Course.closeDate.description')),

        createdAt: getStringDate(t)
          .default(() => new Date(Date.now()))
          .optional(),
        updatedAt: getStringDate(t)
          .default(() => new Date(Date.now()))
          .optional(),

        owner_id: z.string().nonempty().max(36, t('schemas.Course.owner_id.max_message')).default('unknown'),
        collaborators: z.array(z.string()).default([]),

        settings: getCourseSettingsSchema(t),

        /* todo:
      - question-order: 'shuffle, static, ...'
      - question-answer-type: 'drag-drop', 'select', ....

    */
      })
      //* Declares missing question-catgegories in `questionCategories`
      .transform((course) => {
        const questionCategories = course.questionCategories

        // declare missing question categories
        Array.from(new Set(course.questions.map((q) => q.category)))
          .filter((categoryName) => !questionCategories.some((c) => c.name === categoryName))
          .forEach((missingCategoryName) => {
            questionCategories.push({
              id: getUUID(),
              name: missingCategoryName,
              prequisiteCategoryId: null,
              skipOnMissingPrequisite: false,
            })
          })

        return course
      })
      .refine(({ questions, questionCategories }) => questions.every((question) => !!questionCategories?.find((qc) => qc.name === question.category)), {
        message: t('schemas.Course.questionCategories.refinement_message'),
      })
      .superRefine(({ openDate, closeDate }, ctx) => {
        if (closeDate === null) return

        if (isBefore(closeDate, openDate)) {
          ctx.addIssue({
            code: 'custom',
            message: t('schemas.Course.closeDate.superRefine_message'),
            path: ['closeDate'],
          })
        }
      })
  )
}

export type Course = z.output<ReturnType<typeof getCourseSchema>>

const { validate: validateCourse, instantiate: instantiateCourse, safeParse: safeParseCourse } = localizedSchemaUtilities(getCourseSchema)

export { instantiateCourse, safeParseCourse, validateCourse }
