'use server'

import { eq } from 'drizzle-orm'
import { insertQuestionCategories } from '@/database/course/catagories/insert'
import { insertCollaboratorsToKnowledgeCheck } from '@/database/course/collaborators/insert'
import insertKnowledgeCheckQuestions from '@/database/course/questions/insert'
import insertKnowledgeCheckSettings from '@/database/course/settings/insert'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import { Course } from '@/schemas/KnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export default async function insertCourse(course: Course) {
  await requireAuthentication()

  const db = await getDatabase()
  await db.transaction(async (transaction) => {
    try {
      const [{ id }] = await transaction
        .insert(db_knowledgeCheck)
        .values({
          id: course.id,
          name: course.name,
          description: course.description,
          difficulty: course.difficulty,
          share_key: course.share_key,
          owner_id: course.owner_id,
          openDate: formatDatetime(course.openDate),
          closeDate: course.closeDate ? formatDatetime(course.closeDate) : null,
        })
        .$returningId()

      if (!id) throw new Error('Database insert statement did not return inserted-`id`')

      await insertCollaboratorsToKnowledgeCheck(transaction, course.id, course.collaborators)
      await insertKnowledgeCheckSettings(transaction, course)
      const categories = await insertQuestionCategories(transaction, id, course.questionCategories)
      const questionsWithCategoryIds = course.questions.map((q) => {
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

export async function storeCourseShareToken(check_id: Course['id'], token: string) {
  await requireAuthentication()
  const db = await getDatabase()

  await db.update(db_knowledgeCheck).set({ share_key: token }).where(eq(db_knowledgeCheck.id, check_id))
}
