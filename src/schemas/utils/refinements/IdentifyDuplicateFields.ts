import { z, ZodIssueCode } from 'zod'

type MarkMode = 'last' | 'both'

/**
 * Adds field-level issues for duplicates in an array of objects.
 * - mark="last": only the later (duplicate) item gets an error
 * - mark="both": both the first occurrence and the duplicate get errors
 */

/**
 * This function takes in a generic set of items. These items are then mapped to keys using the key function.
 * Then, this function goes through all items to identify duplicate items. In case duplicate items are found / detected.
 * A new zodIssue is created with the message returned by `message(key)`, while also specifying the path to the respective element.
 * By default the function marks the last elements as the duplicates, however this can be modified by setting `mark` to both to mark all elements.
 * @param items The items to check for duplicates
 * @param ctx The superRefine context used to create issues
 * @param opts.field The field-name / property of the schema that is to be inspected
 * @param opts.key A simple function to retrieve a "unique" key for each generic item, used to identify duplicates (elements with same key)
 * @param opts.message The message used in the zodIssue for a given element based on its key.
 * @param opts.mark The mode for creating issues 'last' marks the last duplicate elements as faulty, 'both' marks all elements as faulty
 * @param opts.normalizeKey A simply utility function to prevent e.g the casing of keys to miss out on duplicate matches. --> i.e lower case keys
 */
export default function identifyDuplicateFields<T, K extends string | number>(
  items: T[],
  ctx: z.RefinementCtx,
  opts: {
    field: string // e.g. "answer" or "id"
    key: (item: T) => K
    message: (key: K) => string
    mark?: MarkMode
    normalizeKey?: (key: K) => K
  },
) {
  const { field, key, message, mark = 'last', normalizeKey = (k) => k } = opts

  const firstIndexByKey = new Map<K, number>()

  items.forEach((item, i) => {
    const raw = key(item)
    const k = normalizeKey(raw)

    const firstIndex = firstIndexByKey.get(k)
    if (firstIndex !== undefined) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: message(raw),
        path: [i, field],
      })

      if (mark === 'both') {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: message(raw),
          path: [firstIndex, field],
        })
      }
    } else {
      firstIndexByKey.set(k, i)
    }
  })
}
