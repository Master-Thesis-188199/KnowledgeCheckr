import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'

export const getStringDate = (t: Translator) =>
  z
    .union([z.date(), z.string()])
    .transform((date) => (typeof date === 'string' ? new Date(date) : date))
    .refine((course) => !isNaN(course.getTime()), 'Invalid date value provided')
