import { JSONContent } from '@tiptap/core'
import z from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

const tiptapContent: z.ZodType<JSONContent> = z.object().loose()

export const CourseContentSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  categoryId: z.uuidv4().nonempty(),
  content: tiptapContent.optional(),
})

export type CourseContent = z.output<typeof CourseContentSchema>

const { validate: validateCourseContent, instantiate: instantiateCourseContent, safeParse: safeParseCourseContent } = schemaUtilities(CourseContentSchema)
export { validateCourseContent, instantiateCourseContent, safeParseCourseContent }
