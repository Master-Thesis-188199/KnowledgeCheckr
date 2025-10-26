'use server'

import getDatabase, { getDrizzleDatabase } from '@/database/Database'
import { db_userHasDoneKnowledgeCheck } from '@/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'

export default async function insertExaminationResults(examinationResult: ExaminationSchema) {
  const { user } = await requireAuthentication()
  const db = await getDrizzleDatabase()

  try {
    await db.insert(db_userHasDoneKnowledgeCheck).values({
      userId: user.id,
      knowledgeCheckId: examinationResult.knowledgeCheck.id,
      startedAt: formatDatetime(examinationResult.startedAt),
      finishedAt: formatDatetime(examinationResult.finishedAt ?? new Date(Date.now())),
      score: examinationResult.score,
      results: JSON.stringify(examinationResult.results),
    })
  } catch (e) {
    console.error('Failed to save examination results to database', e)
  }
}
