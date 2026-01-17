import { and, AnyColumn, eq, exists, SQL, sql } from 'drizzle-orm'
import { alias, AnyMySqlTable, BuildAliasTable, MySqlColumn } from 'drizzle-orm/mysql-core'
import { DrizzleDB } from '@/database/Database'
import buildWhere, { TableFilters } from '@/database/utils/buildWhere'
import { Any } from '@/types'

/**
 * This utility function is used to apply query-filters to a directly joined-table, thus by its foreign-key.
 * This means that it adds a clause that ensures that the respective foreign-key and primary-key relation exists along side the filter-clauses.
 *
 * So for example when this utility function is used to create clauses to apply filters for the `KnowledgeCheck_Settings` table it creates a subquery like that:
 * @example
 * ```sql
 * exists (
 *   select 1
 *   from <direct-child>
 *   where child.<foreign-key> = <outer primary-key>
 *     and <...filter clauses>
 * )
 * ```
 *
 * The reason for using dedicated subquery that are wrapped in `exists` is due to the way drizzle parses clauses in combination with `db.query.<table>.findMany`.
 * When filter-clauses (including for different tables) are provided to the `where` property than drizzle replaces all tables-names that differ from the main-table
 * where the `query.<table>` executed on with the main-table name. This then causes columns to not be found, because the table of course does not hold columns of other tables.
 *
 * By creating dedicated subquery that are wrapped in `exists` predicats ensures that filters can be applied, but prevents drizzle from renaming (other) table-names to main-table name.
 *
 *
 * The way the utility function works:
 * 1) Alias the child table which prevents Drizzle from rebinding child columns to the outer query (to the main-table that is joined with other tables).
 * 2) Use `buildWhere(aliasChild, filter)` so all filter clauses use the *aliased child* columns and the respective alias, e.g. 'k.`knowledgecheck_id`'.
 * 3) Build a correlated subquery: `SELECT 1 FROM child WHERE childFk = parentPk AND childWhere`
 * 4) Return `EXISTS (subquery)`
 *
 * @param db - The Drizzle database instance. Used to build a typed subquery with `.select().from().where()`.
 * @param opts.childTable - Child table being filtered.
 * @param opts.aliasName - SQL alias for the child table inside the subquery (e.g. "kcs", "q", "c").
 * @param opts.childFk - Function that picks the FK column from the aliased child table.
 * @param opts.parentPk - Column/expression referencing the parent PK from the outer query (commonly `kc.id`).
 * @param opts.filter - Column-level filter object (your DSL) compiled by `buildWhere`.
 *
 * @returns SQL predicate `exists(...)` if a filter is provided and produces clauses; otherwise `undefined`.
 */
export default function existsByFk<TChild extends AnyMySqlTable, TChildFk extends MySqlColumn<Any>, TParentPk extends AnyColumn>(
  db: DrizzleDB,
  opts: {
    childTable: TChild
    aliasName: string
    childFk: (t: BuildAliasTable<TChild, string>) => TChildFk
    parentPk: TParentPk
    filter?: TableFilters<TChild>
  },
): SQL | undefined {
  if (!opts.filter) return undefined

  // Aliasing is the key to preventing the “wrong table/alias” issues you previously hit.
  const child = alias(opts.childTable, opts.aliasName)

  // use the table-alias to prevent renaming
  const childWhere = buildWhere(child as TChild, opts.filter)
  if (!childWhere) return undefined

  const subquery = db
    .select({ one: sql`1` })
    .from(child)
    .where(and(eq(opts.childFk(child), opts.parentPk), childWhere))

  return exists(sql`${subquery}`)
}
