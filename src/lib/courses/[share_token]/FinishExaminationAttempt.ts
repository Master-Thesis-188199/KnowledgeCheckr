'use server'

import insertExaminationResults from '@/database/examination/insert'
import { ExaminationSchema } from '@/src/schemas/ExaminationSchema'

export default async function finishExaminationAttempt(result: ExaminationSchema) {
  // todo Determinate examination score
  const score = result.knowledgeCheck.questions.reduce((acc, q) => (acc += q.points), 0) * Math.random()

  await insertExaminationResults({ ...result, score })
}
