'use server'

import getDatabase from '@/database/Database'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function finishExaminationAttempt(result: KnowledgeCheck) {
  const db = await getDatabase()
  try {
    db.beginTransaction()
    //todo saving

    db.commit()
    console.log('Examination results saved...')
  } catch (e) {
    db.rollback()
    console.error('Failed to save examination results to database', e)
  }
}
