'use server'

import { eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import { insertQuestionCategories } from '@/database/knowledgeCheck/catagories/insert'
import { insertCollaboratorsToKnowledgeCheck } from '@/database/knowledgeCheck/collaborators/insert'
import insertKnowledgeCheckQuestions from '@/database/knowledgeCheck/questions/insert'
import insertKnowledgeCheckSettings from '@/database/knowledgeCheck/settings/insert'
import { KnowledgeCheck } from '@/schemas/KnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export default async function insertKnowledgeCheck(check: KnowledgeCheck) {
  await requireAuthentication()

  const db = await getDatabase()
  await db.transaction(async (transaction) => {
    try {
      const [{ id }] = await transaction
        .insert(db_knowledgeCheck)
        .values({
          id: check.id,
          name: check.name,
          description: check.description,
          difficulty: check.difficulty,
          share_key: check.share_key,
          owner_id: check.owner_id,
          openDate: formatDatetime(check.openDate),
          closeDate: check.closeDate ? formatDatetime(check.closeDate) : null,
        })
        .$returningId()

      if (!id) throw new Error('Database insert statement did not return inserted-`id`')

      await insertCollaboratorsToKnowledgeCheck(transaction, check.id, check.collaborators)
      await insertKnowledgeCheckSettings(transaction, check)
      const categories = await insertQuestionCategories(transaction, id, check.questionCategories)
      const questionsWithCategoryIds = check.questions.map((q) => {
        const category = categories.find((c) => c.name === q.category)

        if (!category) throw new Error(`Category "${q.category}" not found for question "${q.id}"`)

        return { ...q, categoryId: category.id }
      })

      await insertKnowledgeCheckQuestions(transaction, questionsWithCategoryIds, id)
    } catch (err) {
      logger.info('[Rollback]: Inserting db_knowledgecheck was unsuccessful!', err)
      transaction.rollback()
    }
  })
}

export async function storeKnowledgeCheckShareToken(check_id: KnowledgeCheck['id'], token: string) {
  await requireAuthentication()
  const db = await getDatabase()

  await db.update(db_knowledgeCheck).set({ share_key: token }).where(eq(db_knowledgeCheck.id, check_id))
}
