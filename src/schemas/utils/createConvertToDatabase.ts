import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core'
import { z } from 'zod'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { Any } from '@/types'

/**
 * Convenience alias for an object with string keys.
 * Used by deep key utilities.
 */
export type AnyRecord = Record<string, unknown>

/**
 * Hard depth limit for deep-key extraction to prevent TypeScript performance issues
 * on very large object graphs.
 */
type MaxKeyDepth = 6

/**
 * Extracts a union of **property names** found anywhere within `T` (including nested objects/arrays),
 * with a hard depth limit to keep the compiler fast.
 *
 * Example:
 * ```ts
 * type Keys = DeepPropertyKeys<{ a: { b: number }, items: { id: string }[] }>
 * //   ^? "a" | "b" | "items" | "id"
 * ```
 *
 * @typeParam T - The value type to extract deep property keys from.
 * @typeParam Depth - Internal recursion counter (do not set manually).
 */
export type DeepPropertyKeys<T, Depth extends unknown[] = []> = Depth['length'] extends MaxKeyDepth
  ? never
  : T extends readonly (infer U)[]
    ? DeepPropertyKeys<U, [0, ...Depth]>
    : T extends AnyRecord
      ? keyof T | { [K in keyof T]-?: DeepPropertyKeys<T[K], [0, ...Depth]> }[keyof T]
      : never

/**
 * Removes widened key types (`string | number | symbol`) from a key union.
 *
 * Why this exists:
 * If the input object type is widened (e.g. `{ [k: string]: unknown }` or `any`),
 * the key union can become `string`, which would incorrectly match *every* DB column.
 */
export type NarrowKeys<K> = string extends K ? never : number extends K ? never : symbol extends K ? never : K

/**
 * Extracts the Drizzle `$inferInsert` type from a table.
 *
 * @remarks
 * This yields the shape accepted by `.insert(table).values(...)`.
 */
export type DrizzleInsertShape<Table> = Table extends { $inferInsert: infer Insert } ? Insert : never

/**
 * Computes the set of database column keys that can be matched from `Obj`:
 * - key must exist somewhere in the input object's type (deeply)
 * - key must exist in the Drizzle insert shape
 * - widened keys are rejected to avoid accidental "match everything"
 */
export type MatchedDbKeys<Obj, Table> = Extract<NarrowKeys<DeepPropertyKeys<Obj>>, keyof DrizzleInsertShape<Table>>

/**
 * The compile-time output shape of `convertToDatabase(obj)`:
 * only columns that can be discovered from the input object’s type are included.
 */
export type DbConversionResult<Obj, Table> = Pick<DrizzleInsertShape<Table>, MatchedDbKeys<Obj, Table>>

/* -------------------------------------------------------------------------------------------------
 * Runtime utilities
 * ------------------------------------------------------------------------------------------------- */

/**
 * Searches an object graph for a property matching `searchKey` and returns its value.
 *
 * - Traverses nested objects
 * - Traverses arrays (searches every element)
 * - Returns the first match found (depth-first)
 *
 * @param searchKey - The property name to look for.
 * @param value - The object/array/value to search within.
 * @returns The found value, or `undefined` if no match exists.
 */
export function findDeepPropertyValue(searchKey: string, value: unknown): unknown {
  if (value == null) return undefined

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDeepPropertyValue(searchKey, item)
      if (found !== undefined) return found
    }
    return undefined
  }

  if (typeof value !== 'object') return undefined

  for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
    if (key === searchKey) return inner

    const found = findDeepPropertyValue(searchKey, inner)
    if (found !== undefined) return found
  }

  return undefined
}

/**
 * Converts a JS value to something suitable for a primitive DB column.
 *
 * Supported conversions:
 * - `string | number` -> unchanged
 * - `boolean` -> `1 | 0` (common MySQL convention)
 * - `Date` -> formatted datetime string
 * - `null | undefined` -> unchanged (allows defaults or nullable columns)
 *
 * @param value - The value to convert.
 * @param columnName - Used only to produce helpful error messages.
 * @throws If the value type cannot be converted.
 */
export function toDatabaseScalar(value: unknown, columnName: string = 'unknown'): unknown {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'boolean') return value ? 1 : 0
  if (value instanceof Date) return formatDatetime(value)
  if (value === undefined || value === null) return value

  throw new Error(`Unsupported conversion for column '${columnName}': '${typeof value}'. Value: ${String(value)}`)
}

/**
 * Creates a strongly-typed converter that maps an input object (validated by the provided Zod schema)
 * to a Drizzle insert object for the given table.
 *
 * The returned converter’s output type is dependent on the *actual* input object type at the call site:
 * only keys that can be matched (deeply) from the input object’s type to DB columns will appear.
 *
 * @param schema - Zod schema that describes the input data shape.
 * @param table - Drizzle table to convert into.
 * @returns A `convertToDatabase` function for this schema+table pair.
 */
export default function createConvertToDatabase<Schema extends z.ZodTypeAny, Table extends MySqlTableWithColumns<Any>>(schema: Schema, table: Table) {
  /**
   * Convert a given input object into a DB insert object containing only matched columns.
   *
   * @typeParam Obj - Inferred from the passed object; do not annotate unless necessary.
   * @param obj - The object to convert.
   */
  return function convertToDatabase<const Type extends z.infer<Schema>>(obj: Type): DbConversionResult<Type, Table> {
    const out: Record<string, unknown> = {}
    const columns = Object.keys(table) as (keyof Table['$columns'])[]

    for (const col of columns) {
      const raw = findDeepPropertyValue(String(col), obj)
      if (raw === undefined) continue // don't emit missing keys

      out[String(col)] = toDatabaseScalar(raw, String(col))
    }

    return out as DbConversionResult<Type, Table>
  }
}
