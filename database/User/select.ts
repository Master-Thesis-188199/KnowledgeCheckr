'use server'

import { and, isNull, notLike } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_user } from '@/database/drizzle/schema'

export async function getUsers() {
  const db = await getDatabase()

  const users = await db
    .select()
    .from(db_user)
    .where(and(notLike(db_user.email, '%@example%'), isNull(db_user.isAnonymous)))
    .limit(100)

  return users
}
