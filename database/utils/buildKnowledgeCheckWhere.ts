import { SQL } from 'drizzle-orm'
import { DrizzleDB } from '@/database/Database'
import { db_answer, db_category, db_knowledgeCheck, db_knowledgeCheckSettings, db_question } from '@/database/drizzle'
import { existsAnswerForKnowledgeCheck, existsByFk } from '@/database/knowledgeCheck/query'
import buildWhere, { TableFilters } from '@/database/utils/buildWhere'

export type KnowledgeCheckFilterBundle = {
  /** Filters on the root KnowledgeCheck table. */
  baseFilter?: TableFilters<typeof db_knowledgeCheck>

  /** Filters checks by requiring that the associated settings entry satisfies the filter  */
  settingsFilter?: TableFilters<typeof db_knowledgeCheckSettings>

  /** Filters checks by requiring at least one matching category  */
  categoriesFilter?: TableFilters<typeof db_category>

  /** Filters checks by requiring at least one matching question  */
  questionsFilter?: TableFilters<typeof db_question>

  /** Filters checks by requiring at least one matching answer  */
  answersFilter?: TableFilters<typeof db_answer>
}

type KCFindManyArg = NonNullable<Parameters<DrizzleDB['query']['db_knowledgeCheck']['findMany']>[0]>
type KCWhereFn = Exclude<KCFindManyArg['where'], SQL | undefined>

/**
 * This utility function is combine a knowledgeCheck filter-bundle that allows for easy but deeply nested filtering.
 *
 * The way it works is it uses the `baseFilter` which filters rows base on the basic columns of the `KnowledgeCheck` table
 * and combines them with `EXISTS (<subquery)` clauses for each of the remaining filter-bundle elements.
 *
 * The reason for using subqueries that wrapped within `Exists` is due to the way drizzle converts the basic clauses in combination with `db.query.<table>.findMany`.
 * When the same clauses are simply chained togehter and passed to the `where` of the `db.query.<table>.findMany` then a query like that:
 *    select .... from `KnowledgeCheck`, `KnowledgeCheck_Settings`, .... WHERE .... AND (`KnowledgeCheck_Settings`.`knowledgecheck_id` = ?) ...

 * is transformed into:

 *    select .... from `KnowledgeCheck`, `KnowledgeCheck_Settings`, .... WHERE .... AND (`KnowledgeCheck`.`knowledgecheck_id` = ?) ...

 * because it replaces the filtering-table passed to the `buildWhere` util function that creates the respective `<table-name>` filters are replaced
 * with the name of root table, in this case `KnowledgeCheck`. That of course causes the query to fail because the main-table does not have the property of a joined table... 
 * For that reason, the subsequent filter-bundle elements are added as where-clauses by using subqueries that are wrapped in `Exists` to still apply these filters but prevent 
 * drizzle from renaming the table-aliases / names to the main-table name
 *
 *
 * @param db - Drizzle DB instance used to build correlated subqueries.
 * @param filters - Optional bundle of per-table filters. Each filter adds an additional AND predicate.
 *
 * @returns A `where` callback compatible with `db.query.db_knowledgeCheck.findMany`.
 */
export default function buildKnowledgeCheckWhere(db: DrizzleDB, filters?: KnowledgeCheckFilterBundle): KCWhereFn {
  return (kc, { and }) => {
    const predicates: SQL[] = []

    const rootWhere = buildWhere(db_knowledgeCheck, filters?.baseFilter)
    if (rootWhere) predicates.push(rootWhere)

    const settingsExists = existsByFk(db, {
      childTable: db_knowledgeCheckSettings,
      aliasName: 'kcs',
      childFk: (t) => t.knowledgecheckId,
      parentPk: kc.id,
      filter: filters?.settingsFilter,
    })
    if (settingsExists) predicates.push(settingsExists)

    const categoriesExists = existsByFk(db, {
      childTable: db_category,
      aliasName: 'c',
      childFk: (t) => t.knowledgecheckId,
      parentPk: kc.id,
      filter: filters?.categoriesFilter,
    })
    if (categoriesExists) predicates.push(categoriesExists)

    const questionsExists = existsByFk(db, {
      childTable: db_question,
      aliasName: 'q',
      childFk: (t) => t.knowledgecheckId,
      parentPk: kc.id,
      filter: filters?.questionsFilter,
    })
    if (questionsExists) predicates.push(questionsExists)

    const answersExists = existsAnswerForKnowledgeCheck(db, kc.id, filters?.answersFilter, filters?.questionsFilter)
    if (answersExists) predicates.push(answersExists)

    return predicates.length ? and(...predicates) : undefined
  }
}
