import { z } from 'zod'
import { getUUID } from '@/src/lib/Shared/getUUID'

export const CategorySchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => getUUID()),
  name: z.string(),
  prequisiteCategoryId: z.string().min(1, 'A prerequisite category may not be empty!').optional(),
  skipOnMissingPrequisite: z.boolean().default(false),
})

export type CategorySchema = z.infer<typeof CategorySchema>
