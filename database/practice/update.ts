'use server'

import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userHasDoneCourse } from '@/database/drizzle'
import { PracticeState } from '@/src/hooks/courses/[share_token]/practice/PracticeStore'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export async function updatePracticeResults({
  startedAt,
  results,
  ...values
}: { results: PracticeState['results']; startedAt: PracticeState['startedAt'] } & Omit<typeof db_userHasDoneCourse.$inferInsert, 'startedAt' | 'results' | 'finishedAt' | 'id' | 'userId' | 'type'>) {
  const {
    user: { id: userId },
  } = await requireAuthentication()

  const db = await getDatabase()

  logger.info(`Updating practice results for user: ${userId}`)

  const result = await db
    .update(db_userHasDoneCourse)
    .set({
      results: results,
      score: values.score,
      finishedAt: formatDatetime(new Date(Date.now())),
    })
    .where(
      and(
        eq(db_userHasDoneCourse.knowledgeCheckId, values.knowledgeCheckId),
        eq(db_userHasDoneCourse.startedAt, formatDatetime(startedAt)),
        eq(db_userHasDoneCourse.userId, userId),
        eq(db_userHasDoneCourse.type, 'practice'),
      ),
    )
    .limit(1)

  return { success: result[0].affectedRows === 1 }
}
