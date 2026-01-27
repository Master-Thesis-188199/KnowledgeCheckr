'use server'

import { and, eq } from 'drizzle-orm'
import getDatabase, { DrizzleDB } from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import { updateCategories } from '@/database/knowledgeCheck/catagories/update'
import { updateCollaborators } from '@/database/knowledgeCheck/collaborators/update'
import { updateQuestions } from '@/database/knowledgeCheck/questions/update'
import { updateSettings } from '@/database/knowledgeCheck/settings/update'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { LodashDifferences } from '@/src/lib/checks/create/SaveAction'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheck, KnowledgeCheckSchema } from '@/src/schemas/KnowledgeCheck'
import createConvertToDatabase from '@/src/schemas/utils/createConvertToDatabase'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export async function updateKnowledgeCheck(modifiedCheck: KnowledgeCheck, changes: LodashDifferences<KnowledgeCheck>) {
  await requireAuthentication()

  const db = await getDatabase()

  const changedKeys = changes.map((change) => change.key)

  await db.transaction(async (tx) => {
    try {
      if (changedKeys.includes('settings')) {
        logger.verbose('Updating `settings` of modified check')
        await updateSettings(tx, modifiedCheck.settings)
      }

      if (changedKeys.includes('collaborators')) {
        logger.verbose('Updating `collaborators` of modified check')
        await updateCollaborators(tx, modifiedCheck.id, modifiedCheck.collaborators)
      }

      if (changedKeys.includes('questions')) {
        logger.verbose('Updating `questions` of modified check')
        await updateQuestions(tx, modifiedCheck.id, modifiedCheck.questions)
      }
      if (changedKeys.includes('questionCategories')) {
        logger.verbose('Updating `questionCategories` of modified check')
        await updateCategories(tx, modifiedCheck.id, modifiedCheck.questionCategories)
      }

      // base properties have changed
      if (changedKeys.filter((key) => key !== 'settings' && key !== 'collaborators' && key !== 'questionCategories' && key !== 'questions').length > 0) {
        logger.verbose('Updating base-properties of modified check')
        await updateBaseCheckProperties(tx, modifiedCheck)
      }
    } catch (err) {
      await tx.rollback()
      logger.error('[Rollback]: Error updating knowledge check:', err)
    }
  })
}

async function updateBaseCheckProperties(db: DrizzleDB, check: KnowledgeCheck) {
  const convertTo = createConvertToDatabase(KnowledgeCheckSchema, db_knowledgeCheck)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, updatedAt, ...updates } = convertTo(check)

  await db.update(db_knowledgeCheck).set(updates).where(eq(db_knowledgeCheck.id, check.id))
}

export async function updateKnowledgeCheckShareToken({ checkId, token }: { checkId: KnowledgeCheck['id']; token: KnowledgeCheck['share_key'] }) {
  const {
    user: { id: userId },
  } = await requireAuthentication()
  const db = await getDatabase()

  const result = await db
    .update(db_knowledgeCheck)
    .set({ share_key: token })
    .where(and(eq(db_knowledgeCheck.id, checkId), eq(db_knowledgeCheck.owner_id, userId)))
  return result[0].affectedRows > 0
}
