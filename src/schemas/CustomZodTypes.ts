import { z } from 'zod'

export const StringDate = z
  .union([z.date(), z.string()])
  .transform((date) => (typeof date === 'string' ? new Date(date) : date))
  .refine((check) => !isNaN(check.getTime()), 'Invalid date value provided')
