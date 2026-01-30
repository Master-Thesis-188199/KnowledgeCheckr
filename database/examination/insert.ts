'use server'

import getDatabase from '@/database/Database'
import { db_userHasDoneKnowledgeCheck } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export default async function insertExaminationResults(examinationResult: ExaminationSchema) {
  const { user } = await requireAuthentication()
  const db = await getDatabase()

  try {
    await db.insert(db_userHasDoneKnowledgeCheck).values({
      userId: user.id,
      knowledgeCheckId: examinationResult.knowledgeCheck.id,
      startedAt: formatDatetime(examinationResult.startedAt),
      finishedAt: formatDatetime(examinationResult.finishedAt ?? new Date(Date.now())),
      score: examinationResult.score,
      results: examinationResult.results,
      type: 'examination',
    })
  } catch (e) {
    logger.error('Failed to save examination results to database', e)
  }
}
