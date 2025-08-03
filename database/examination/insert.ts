'use server'

import getDatabase from '@/database/Database'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function insertExaminationResults(results: KnowledgeCheck, score: number) {
  const { user } = await requireAuthentication()
  const db = await getDatabase()

  try {
    await db.exec('INSERT INTO `User_has_done_KnowledgeCheck`(`user_id`, `knowledgeCheck_id`, `startedAt`, `finishedAt`, `score`, `results`) VALUES (?, ?, ?, ?, ?, ?)', [
      user.id,
      results.id,
      // todo use actual start and end times
      formatDatetime(new Date(Date.now())),
      formatDatetime(new Date(Date.now() + 3600 * 1000)),
      score,
      JSON.stringify(results.questions),
    ])
  } catch (e) {
    console.error('Failed to save examination results to database', e)
  }
}
