import { z } from 'zod'

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  prequisiteCategory: z
    .union([z.string().min(1, 'A prerequisite category may not be empty!'), z.array(z.string().min(1, 'A prerequisite category may not be empty!'))])
    .transform((val) => (typeof val === 'string' ? [val] : val))
    .refine((pre) => pre.filter((c, i, a) => a.indexOf(c) === i).length !== pre.length, { message: 'Please remove duplicate prequisite categories.' })
    .optional(),
  skipOnMissingPrequisite: z.boolean().default(false).optional(),
})

export type CategorySchema = z.infer<typeof CategorySchema>
