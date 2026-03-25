import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

export const getCategorySchema = (t: Translator) =>
  z.object({
    id: z.uuidv4().default(() => getUUID()),
    name: z.string(),
    prequisiteCategoryId: z.string().min(1, t('schemas.Category.prerequisiteCategoryId.min_constraint_message')).nullable().default(null),
    skipOnMissingPrequisite: z.boolean().default(false),
  })

const { instantiate: instantiateCategory, validate: validateCategory, safeParse: safeParseCategory } = localizedSchemaUtilities(getCategorySchema)
export { instantiateCategory, validateCategory, safeParseCategory }

export type Category = z.output<ReturnType<typeof getCategorySchema>>
