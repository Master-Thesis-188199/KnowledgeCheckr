'use server'

import getDatabase from '@/database/Database'
import { db_userHasDoneKnowledgeCheck } from '@/database/drizzle'
import { PracticeState } from '@/src/hooks/checks/[share_token]/practice/PracticeStore'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export async function insertPracticeResults({
  startedAt,
  results,
  ...values
}: { results: PracticeState['results']; startedAt: PracticeState['startedAt'] } & Omit<
  typeof db_userHasDoneKnowledgeCheck.$inferInsert,
  'startedAt' | 'results' | 'finishedAt' | 'id' | 'userId' | 'type'
>) {
  const {
    user: { id: userId },
  } = await requireAuthentication()

  const db = await getDatabase()

  logger.info(`Inserting practice data for user: ${userId}`)

  await db.insert(db_userHasDoneKnowledgeCheck).values({
    userId,
    startedAt: formatDatetime(startedAt),
    type: 'practice',
    results: results,
    finishedAt: formatDatetime(new Date(Date.now())),
    ...values,
  })
}
