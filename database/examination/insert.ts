'use server'

import getDatabase from '@/database/Database'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'

export default async function insertExaminationResults(examinationResult: ExaminationSchema) {
  const { user } = await requireAuthentication()
  const db = await getDatabase()

  try {
    await db.exec('INSERT INTO `User_has_done_KnowledgeCheck`(`user_id`, `knowledgeCheck_id`, `startedAt`, `finishedAt`, `score`, `results`) VALUES (?, ?, ?, ?, ?, ?)', [
      user.id,
      examinationResult.knowledgeCheck.id,
      // todo use actual start and end times
      formatDatetime(examinationResult.startedAt),
      formatDatetime(examinationResult.finishedAt ?? new Date(Date.now())),
      examinationResult.score,
      JSON.stringify(examinationResult.results),
    ])
  } catch (e) {
    console.error('Failed to save examination results to database', e)
  }
}
