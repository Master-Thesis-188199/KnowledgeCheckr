import { and, AnyColumn, eq, exists, SQL, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'
import { DrizzleDB } from '@/database/Database'
import { db_answer, db_question } from '@/database/drizzle'
import buildWhere, { TableFilters } from '@/database/utils/buildWhere'

/**
 * This utility function applies the `answerFilter` and `questionFilter` filters by creating a subquery that is wrapped in `Exists`.
 * Thereby ensuring that only joined-entries are returned that have e.g. at least on answer matching a given name.
 *
 * Note that the subquery used in the `Exists` predacte joins the `KnowledgeCheck`, `Questions` and `Answer` table,
 * because otherwise there an answer does not store the FK of the repsective `KnowledgeCheck` entry it belongs to.
 *
 * @example
 * ```sql
 * exists (
 *   select 1
 *   from Answer a
 *   join Question q on a.questionId = q.id
 *   where q.knowledgecheckId = <outer kc.id>
 *     and <answer filters?>
 *     and <question filters?>
 * )
 * ```
 *
 * - Both `answerFilter` and `questionFilter` are optional; if neither is provided, returns `undefined`.
 * - Uses aliased tables (`a`, `q`) to prevent table/alias-naming collisions.
 *
 * @param db - Drizzle DB instance used to build the subquery.
 * @param kcId - The FK of the knowledgeCheck row to which the respective `question-` and `answer-` filters shall be applied.
 * @param answerFilter - Column-level filters for Answer.
 * @param questionFilter - Column-level filters for Question
 */
export default function existsAnswerForKnowledgeCheck(
  db: DrizzleDB,
  kcId: AnyColumn,
  answerFilter?: TableFilters<typeof db_answer>,
  questionFilter?: TableFilters<typeof db_question>,
): SQL | undefined {
  if (!answerFilter && !questionFilter) return undefined

  const a = alias(db_answer, 'a')
  const q = alias(db_question, 'q')

  // join respective check with questions and answers to apply filters
  const predicates: SQL[] = [eq(q.knowledgecheckId, kcId), eq(a.questionId, q.id)]

  if (answerFilter) {
    const answerWhere = buildWhere(a, answerFilter)
    if (answerWhere) predicates.push(answerWhere)
  }

  if (questionFilter) {
    const questionWhere = buildWhere(q, questionFilter)
    if (questionWhere) predicates.push(questionWhere)
  }

  const subquery = db
    .select({ one: sql`1` })
    .from(a)
    .innerJoin(q, eq(a.questionId, q.id))
    .where(and(...predicates))

  return exists(sql`${subquery}`)
}
