import { JSONContent } from '@tiptap/core'
import z from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

export const getCourseContentSchema = (t: Translator) =>
  z.object({
    title: z.string().nonempty(t('schemas.CourseContent.title.nonempty_message')).describe(t('schemas.CourseContent.title.description')),
    description: z.string().optional().describe(t('schemas.CourseContent.description.description')),
    categoryId: z.uuidv4(t('schemas.CourseContent.categoryId.uuidv4_message')),
    content: z.custom<JSONContent>().optional(),
  })

export type CourseContent = z.output<ReturnType<typeof getCourseContentSchema>>

const { validate: validateCourseContent, instantiate: instantiateCourseContent, safeParse: safeParseCourseContent } = localizedSchemaUtilities(getCourseContentSchema)
export { validateCourseContent, instantiateCourseContent, safeParseCourseContent }
