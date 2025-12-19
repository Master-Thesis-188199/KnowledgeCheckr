import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  prequisiteCategoryId: z.string().min(1, 'A prerequisite category may not be empty!').optional(),
  skipOnMissingPrequisite: z.boolean().default(false),
})

export type CategorySchema = z.infer<typeof CategorySchema>
