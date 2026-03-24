import { JSONContent } from '@tiptap/core'
import z from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

export const getCourseContentSchema = (t: Translator) =>
  z.object({
    title: z.string().nonempty("A content's title can not be empty.").describe('Used to quickly identify a given content of a category'),
    description: z.string().optional().describe('Describes the content associated to a given category.'),
    categoryId: z.uuidv4('Selecting a category is required'),
    content: z.custom<JSONContent>().optional(),
  })

export type CourseContent = z.output<ReturnType<typeof getCourseContentSchema>>

const { validate: validateCourseContent, instantiate: instantiateCourseContent, safeParse: safeParseCourseContent } = localizedSchemaUtilities(getCourseContentSchema)
export { validateCourseContent, instantiateCourseContent, safeParseCourseContent }
