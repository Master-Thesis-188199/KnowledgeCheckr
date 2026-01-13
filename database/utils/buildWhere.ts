/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, between, eq, gt, gte, inArray, isNotNull, isNull, like, lt, lte, or, type SQL, sql } from 'drizzle-orm'

type NullOps = { op: 'isNull' } | { op: 'isNotNull' }

type InOps<T> = { op: 'in'; value: T[] }

export type StringOps =
  | { op: 'eq'; value: string }
  | { op: 'contains'; value: string; ignoreCasing?: boolean }
  | { op: 'startsWith'; value: string; ignoreCasing?: boolean }
  | { op: 'endsWith'; value: string; ignoreCasing?: boolean }
  | { op: 'like'; value: string; ignoreCasing?: boolean } // raw LIKE pattern e.g. "%foo_"
  | InOps<string>
  | NullOps

type NumberOps =
  | { op: 'eq'; value: number }
  | { op: 'gt'; value: number }
  | { op: 'gte'; value: number }
  | { op: 'lt'; value: number }
  | { op: 'lte'; value: number }
  | { op: 'between'; value: [number, number] }
  | InOps<number>
  | NullOps

type BooleanOps = { op: 'eq'; value: boolean } | NullOps

type DateOps = { op: 'eq'; value: Date } | { op: 'before'; value: Date } | { op: 'after'; value: Date } | { op: 'between'; value: [Date, Date] } | NullOps

type NonNull<T> = Exclude<T, null | undefined>

type OpsFor<T> =
  NonNull<T> extends string
    ? StringOps
    : NonNull<T> extends number
      ? NumberOps
      : NonNull<T> extends boolean
        ? BooleanOps
        : NonNull<T> extends Date
          ? DateOps
          : // fallback: only allow equality + null checks
            { op: 'eq'; value: NonNull<T> } | NullOps

export type TableFilters<TTable extends { $inferSelect: any }> = Partial<{ [K in keyof TTable['$inferSelect']]: OpsFor<TTable['$inferSelect'][K]> }>

/**
 * Escapes % and _ so "contains" searches are literal by default.
 * (Optional but recommended.)
 */
function escapeLikeLiteral(input: string) {
  // Escape backslash first, then % and _
  return input.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_')
}

export default function buildWhere<TTable extends { $inferSelect: any }>(table: TTable, filters?: TableFilters<TTable>, type: 'and' | 'or' = 'and'): SQL | undefined {
  if (!filters) return undefined

  const clauses: SQL[] = []

  for (const [key, f] of Object.entries(filters) as Array<[keyof TableFilters<TTable>, TableFilters<TTable>[keyof TableFilters<TTable>]]>) {
    if (!f) continue

    // Drizzle tables expose columns as properties, but TS can’t strongly type index access here.
    const col = (table as any)[key as string]
    if (!col) continue

    switch (f.op) {
      case 'isNull':
        clauses.push(isNull(col))
        break

      case 'isNotNull':
        clauses.push(isNotNull(col))
        break

      case 'eq':
        clauses.push(eq(col, (f as any).value))
        break

      case 'gt':
        clauses.push(gt(col, (f as any).value))
        break

      case 'gte':
        clauses.push(gte(col, (f as any).value))
        break

      case 'lt':
        clauses.push(lt(col, (f as any).value))
        break

      case 'lte':
        clauses.push(lte(col, (f as any).value))
        break

      case 'between': {
        const [a, b] = (f as any).value
        clauses.push(between(col, a, b))
        break
      }

      case 'in':
        clauses.push(inArray(col, (f as any).value))
        break

      case 'contains': {
        const option = f as Extract<StringOps, { op: 'contains' }>
        const v = escapeLikeLiteral(option.value)
        const pattern = `%${v}%`
        //* by default like when using %<string>% mysql ignores the strings casing...
        clauses.push(option.ignoreCasing ? like(col, pattern) : sql`${col} like ${pattern} COLLATE utf8mb4_0900_as_cs`)
        break
      }

      case 'startsWith': {
        const option = f as Extract<StringOps, { op: 'startsWith' }>
        const v = escapeLikeLiteral(option.value)
        const pattern = `${v}%`
        clauses.push(option.ignoreCasing ? like(col, pattern) : sql`${col} like ${pattern} COLLATE utf8mb4_0900_as_cs`)
        break
      }

      case 'endsWith': {
        const option = f as Extract<StringOps, { op: 'endsWith' }>
        const v = escapeLikeLiteral(option.value)
        const pattern = `%${v}`
        clauses.push(option.ignoreCasing ? like(col, pattern) : sql`${col} like ${pattern} COLLATE utf8mb4_0900_as_cs`)
        break
      }

      case 'like': {
        const option = f as Extract<StringOps, { op: 'like' }>
        const pattern = option.value
        clauses.push(option.ignoreCasing ? like(col, pattern) : sql`${col} like ${pattern} COLLATE utf8mb4_0900_as_cs`)
        break
      }

      case 'before':
        clauses.push(lt(col, (f as any).value))
        break

      case 'after':
        clauses.push(gt(col, (f as any).value))
        break

      default:
        throw new Error(`Unsupported filter op: ${(f as any).op}`)
    }
  }

  const joinOperand = type === 'and' ? and : or
  return clauses.length ? joinOperand(...clauses) : undefined
}
