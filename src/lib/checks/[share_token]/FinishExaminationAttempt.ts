'use server'

import insertExaminationResults from '@/database/examination/insert'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function finishExaminationAttempt(result: KnowledgeCheck) {
  // todo Determinate examination score
  const score = result.questions.reduce((acc, q) => (acc += q.points), 0) * Math.random()

  await insertExaminationResults(result, score)
}
