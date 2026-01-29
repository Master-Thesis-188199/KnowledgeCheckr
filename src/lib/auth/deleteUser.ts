import 'server-only'
import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_user, db_userHasDoneKnowledgeCheck } from '@/database/drizzle/schema'
import { BetterAuthUser } from '@/src/lib/auth/server'
import _logger from '@/src/lib/log/Logger'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

/**
 * This server-action deletes a given user based on the provided id.
 * Based on the optional prop `abortOnExaminationResults` the deletion will be aborted when user has made examination-attempts to not loose that information.
 * When a user has no examination-attempts the user will be deleted.
 * @param userId Determines which user is about to be deleted
 * @param abortOnExaminationResults When set to true the deletion will be aborted when the user has examination-attempts, preventing accidential purging of said data.
 */
export async function deleteUser({ userId, abortOnExaminationResults }: { userId: BetterAuthUser['id']; abortOnExaminationResults: boolean }) {
  const db = await getDatabase()

  const hasExaminationAttempts = await db
    .select()
    .from(db_userHasDoneKnowledgeCheck)
    .where(and(eq(db_userHasDoneKnowledgeCheck.userId, userId), eq(db_userHasDoneKnowledgeCheck.type, 'examination')))

  if (abortOnExaminationResults === true && hasExaminationAttempts.length > 0) {
    logger.warn('Deletion of anonymous user data aborted, because of existing examination-results.')
    return
  }

  logger.info(`Anonymous user data about to be deleted: { userId: ${userId} }`)
  await db.delete(db_user).where(eq(db_user.id, userId))
}
