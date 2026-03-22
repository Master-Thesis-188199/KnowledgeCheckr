import { JSONContent } from '@tiptap/core'
import z from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

const tiptapContent: z.ZodType<JSONContent> = z.any()

export const CourseContentSchema = z.object({
  title: z.string().nonempty("A content's title can not be empty.").describe('Used to quickly identify a given content of a category'),
  description: z.string().optional().describe('Describes the content associated to a given category.'),
  categoryId: z.uuidv4().nonempty(),
  content: tiptapContent.optional(),
})

export type CourseContent = z.output<typeof CourseContentSchema>

const { validate: validateCourseContent, instantiate: instantiateCourseContent, safeParse: safeParseCourseContent } = schemaUtilities(CourseContentSchema)
export { validateCourseContent, instantiateCourseContent, safeParseCourseContent }
