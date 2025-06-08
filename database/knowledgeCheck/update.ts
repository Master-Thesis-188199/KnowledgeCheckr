import getDatabase from '@/database/Database'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { User } from 'better-auth'

export async function updateKnowledgeCheck(user_id: User['id'], updatedCheck: KnowledgeCheck) {
  const db = await getDatabase()

  await db.beginTransaction()

  try {
    await db.exec('DELETE FROM KnowledgeCheck WHERE id = ?', [updatedCheck.id])
    await insertKnowledgeCheck(user_id, updatedCheck, false)

    await db.commit()
  } catch (err) {
    await db.rollback()
    console.error('[Rollback]: Error updating knowledge check:', err)
  }
}
