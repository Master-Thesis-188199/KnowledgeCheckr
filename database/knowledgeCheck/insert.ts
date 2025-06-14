'use server'

import getDatabase from '@/database/Database'
import insertKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/insert'
import insertKnowledgeCheckSettings from '@/database/knowledgeCheck/settings/insert'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import { User } from 'better-auth'

export default async function insertKnowledgeCheck(user_id: User['id'], check: KnowledgeCheck, transaction = true) {
  const db = await getDatabase()

  if (transaction) await db.beginTransaction()

  try {
    // todo: update open-date value to be date-object or enforce date-string-format
    const { id: check_id } = await db.insert(
      'INSERT INTO KnowledgeCheck (id, name, description, owner_id, public_token, openDate, closeDate, difficulty, createdAt, updatedAt, expiresAt) Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        check.id,
        check.name,
        check.description || null,
        user_id,
        check.share_key || null,
        new Date(Date.parse(check.openDate)).toISOString().slice(0, 19).replace('T', ' '),
        check.closeDate ? new Date(Date.parse(check.closeDate)).toISOString().slice(0, 19).replace('T', ' ') : null,
        check.difficulty,
        new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '),
        new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '),
        check.closeDate ? new Date(Date.parse(check.closeDate)).toISOString().slice(0, 19).replace('T', ' ') : null,
      ],
    )

    await insertKnowledgeCheckSettings(db, null, check_id)
    await insertKnowledgeCheckQuestions(db, check.questions, check_id)
  } catch (err) {
    await db.rollback()
  }

  if (transaction) await db.commit()
}
