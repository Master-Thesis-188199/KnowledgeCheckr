import { getTableColumns } from 'drizzle-orm'
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import getKeys from '@/src/lib/Shared/Keys'
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
      ? // if T has an index signature (keyof T is string), don’t recurse into it
        string extends keyof T
        ? never
        :
            | keyof T
            | {
                [K in keyof T]-?: DeepPropertyKeys<T[K], [0, ...Depth]>
              }[keyof T]
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
export function findDeepPropertyValue(searchKey: string, value: unknown, visited = new WeakSet<object>()): unknown {
  if (value == null) return undefined

  if (Array.isArray(value)) {
    if (visited.has(value)) return undefined
    visited.add(value)

    for (const item of value) {
      const found = findDeepPropertyValue(searchKey, item, visited)
      if (found !== undefined) return found
    }
    return undefined
  }

  if (typeof value !== 'object') return undefined

  if (visited.has(value)) return undefined
  visited.add(value)

  for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
    if (key === searchKey) return inner

    const found = findDeepPropertyValue(searchKey, inner, visited)
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
  if (value instanceof Date) return formatDatetime(value)
  if (value === undefined || value === null) return value
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'object') return value
  if (typeof value === 'boolean') return value ? 1 : 0

  throw new Error(`Unsupported conversion for column '${columnName}': '${typeof value}'. Value: ${String(value)}`)
}

/**
 * Convert a given input object into a DB insert object containing only matched columns.
 *
 * @typeParam Type - Inferred from the passed object; do not annotate unless necessary.
 * @param obj - The object to convert.
 * @param table - Drizzle table to convert into.
 */
export default function convertToDatabase<const Type extends object, Table extends MySqlTableWithColumns<Any>>(obj: Type | null, table: Table): DbConversionResult<Type, Table> {
  const out: Record<string, unknown> = {}
  const columns = getTableColumns(table)

  for (const col of getKeys(columns)) {
    const raw = findDeepPropertyValue(String(col), obj)
    if (raw === undefined) continue // don't emit missing keys

    out[String(col)] = toDatabaseScalar(raw, String(col))
  }

  return out as DbConversionResult<Type, Table>
}
