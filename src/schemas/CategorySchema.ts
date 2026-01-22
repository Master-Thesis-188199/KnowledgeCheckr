import { z } from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

export const CategorySchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => getUUID()),
  name: z.string(),
  prequisiteCategoryId: z.string().min(1, 'A prerequisite category may not be empty!').nullable().default(null),
  skipOnMissingPrequisite: z.boolean().default(false),
})

const { instantiate: instantiateCategory, validate: validateCategory, safeParse: safeParseCategory } = schemaUtilities(CategorySchema)
export { instantiateCategory, validateCategory, safeParseCategory }

export type CategorySchema = z.infer<typeof CategorySchema>
