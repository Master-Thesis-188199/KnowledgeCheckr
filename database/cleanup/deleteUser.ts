import { and, eq, SQL } from 'drizzle-orm'
import isEmpty from 'lodash/isEmpty'
import getDatabase from '@/database/Database'
import { db_user } from '@/database/drizzle/schema'
import { BetterAuthUser } from '@/src/lib/auth/server'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

/**
 * Caution: Providing invalid filters may lead to loss of data!
 * Delete user(s) that match the given filter-params.
 * @param userProps The filters that should be applied when deleting users
 * @param options.limit Defines the max amount of users to be deleted. Default is 1. To delete all users matching the fitlers, set the limit to -1.
 * @returns An array of deleted user-information.
 */
export default async function deleteUser(userProps: Partial<BetterAuthUser>, { limit = 1 }: { limit?: number } = {}): Promise<Pick<BetterAuthUser, 'id' | 'email' | 'name'>[]> {
  if (!userProps || isEmpty(userProps)) return []

  const db = await getDatabase()

  const filters: Array<SQL<unknown>> = []

  for (const _key of Object.keys(userProps)) {
    const key = _key as keyof typeof userProps
    if (userProps[key] === null || userProps[key] === undefined) continue
    if (db_user[key] === null || db_user[key] === undefined) continue
    if (!(key in db_user)) continue

    const stringifyProp = (value: Exclude<(typeof userProps)[keyof typeof userProps], null | undefined>): string => {
      if (typeof value === 'object') {
        return formatDatetime(value)
      }
      if (typeof value === 'boolean') {
        return !!value ? '1' : '0'
      }

      return value
    }

    filters.push(eq(db_user[key], stringifyProp(userProps[key])))
  }

  if (filters.length === 0) {
    console.log('[DeleteUsers]: No valid filters derived from userProps, aborting delete. ', JSON.stringify(userProps))
    return []
  }

  const users = await db
    .select()
    .from(db_user)
    .where(filters.length > 1 ? and(...filters) : filters.at(0))
    .limit(limit)

  if (users.length === 0) {
    console.log(`[DeleteUsers]: Found no users matching filter${filters.length > 1 ? 's' : ''}: ${JSON.stringify(userProps)}`)
    return []
  }

  const deleted: Pick<BetterAuthUser, 'id' | 'email' | 'name'>[] = []

  for (const { id: userId, email, name } of users) {
    const [result] = await db.delete(db_user).where(eq(db_user.id, userId)).limit(1)
    if (result.affectedRows === 1) {
      console.log(`[DeleteUsers]: Successfully deleted user with email: ${email}.`)
      deleted.push({ id: userId, email, name })
    } else return deleted
  }
  return deleted
}
