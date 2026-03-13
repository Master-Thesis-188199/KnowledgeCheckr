import { isBefore } from 'date-fns/isBefore'
import { z } from 'zod'
import { schemaUtilities } from '@/schemas/utils/schemaUtilities'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import { CategorySchema } from '@/src/schemas/CategorySchema'
import { CourseSettingsSchema } from '@/src/schemas/CourseSettingsSchema'
import { StringDate } from '@/src/schemas/CustomZodTypes'
import { QuestionSchema } from '@/src/schemas/QuestionSchema'

export const CourseSchema = z
  .object({
    id: z.uuidv4().default(() => getUUID()),

    name: z.string().default('schemas.Course.name.default').describe('schemas.Course.name.description'),

    description: z
      .string()
      .nullable()
      .default(() => lorem().substring(0, Math.floor(Math.random() * 100)))
      .describe('schemas.Course.description.description'),

    difficulty: z
      .number()
      .min(1, 'schemas.Course.difficulty.min_max_message')
      .max(10, 'schemas.Course.difficulty.min_max_message')
      .optional()
      .default(() => (Math.floor(Math.random() * 1000) % 10) + 1)
      .describe('schemas.Course.difficulty.description'),

    questions: z.array(QuestionSchema).refine((questions) => questions.length === new Set(questions.map((q) => q.id)).size, { message: 'schemas.Course.questions.refinement_message ' }),
    questionCategories: z
      .array(CategorySchema)
      .optional()
      .default(() => [{ id: getUUID(), name: 'general', skipOnMissingPrequisite: false, prequisiteCategoryId: null }]),

    share_key: z.string().nullable().default(null),

    openDate: z
      .date()
      .or(z.string())
      .transform((date) => (typeof date === 'string' ? new Date(date) : date))
      .refine((course) => !isNaN(course.getTime()), 'schemas.Shared.date_nan_time')
      // .refine((date) => isFuture(addDays(date, 1)), 'The openDate cannot be in the past!')
      .default(() => new Date(Date.now()))
      .describe('schemas.Course.openDate.description'),
    closeDate: z
      .date()
      .or(z.string())
      .transform((date) => (typeof date === 'string' ? new Date(date) : date))
      .refine((course) => !isNaN(course.getTime()), 'schemas.Shared.date_nan_time')
      // .refine((date) => isFuture(addDays(date, 1)), 'The closeDate cannot be in the past!')
      .nullable()
      .default(null)
      .describe('schemas.Course.closeDate.description'),

    createdAt: StringDate.default(() => new Date(Date.now())).optional(),
    updatedAt: StringDate.default(() => new Date(Date.now())).optional(),

    owner_id: z.string().nonempty().max(36, 'schemas.Course.owner_id.max_message').default('unknown'),
    collaborators: z.array(z.string()).default([]),

    settings: CourseSettingsSchema,

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
    message: 'schemas.Course.questionCategories.refinement_message',
  })
  .superRefine(({ openDate, closeDate }, ctx) => {
    if (closeDate === null) return

    if (isBefore(closeDate, openDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'schemas.Course.closeDate.superRefine_message',
        path: ['closeDate'],
      })
    }
  })

export type Course = z.output<typeof CourseSchema>

const { validate: validateCourse, instantiate: instantiateCourse, safeParse: safeParseCourse } = schemaUtilities(CourseSchema)
export { instantiateCourse, safeParseCourse, validateCourse }
