'use server'

import { and, eq } from 'drizzle-orm'
import { updateCategories } from '@/database/course/catagories/update'
import { updateCollaborators } from '@/database/course/collaborators/update'
import { updateQuestions } from '@/database/course/questions/update'
import { updateSettings } from '@/database/course/settings/update'
import getDatabase, { DrizzleDB } from '@/database/Database'
import { db_course } from '@/database/drizzle/schema'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { LodashDifferences } from '@/src/lib/checks/create/SaveAction'
import _logger from '@/src/lib/log/Logger'
import { Course, CourseSchema } from '@/src/schemas/KnowledgeCheck'
import createConvertToDatabase from '@/src/schemas/utils/createConvertToDatabase'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export async function updateCourse(modifiedCourse: Course, changes: LodashDifferences<Course>) {
  await requireAuthentication()

  const db = await getDatabase()

  const changedKeys = changes.map((change) => change.key)

  await db.transaction(async (tx) => {
    try {
      if (changedKeys.includes('settings')) {
        logger.verbose('Updating `settings` of modified course')
        await updateSettings(tx, modifiedCourse.settings)
      }

      if (changedKeys.includes('collaborators')) {
        logger.verbose('Updating `collaborators` of modified course')
        await updateCollaborators(tx, modifiedCourse.id, modifiedCourse.collaborators)
      }

      if (changedKeys.includes('questions')) {
        logger.verbose('Updating `questions` of modified course')
        await updateQuestions(tx, modifiedCourse.id, modifiedCourse.questions)
      }
      if (changedKeys.includes('questionCategories')) {
        logger.verbose('Updating `questionCategories` of modified course')
        await updateCategories(tx, modifiedCourse.id, modifiedCourse.questionCategories)
      }

      // base properties have changed
      if (changedKeys.filter((key) => key !== 'settings' && key !== 'collaborators' && key !== 'questionCategories' && key !== 'questions').length > 0) {
        logger.verbose('Updating base-properties of modified course')
        await updateBaseCourseProperties(tx, modifiedCourse)
      }
    } catch (err) {
      await tx.rollback()
      logger.error('[Rollback]: Error updating course:', err)
    }
  })
}

async function updateBaseCourseProperties(db: DrizzleDB, course: Course) {
  const convertTo = createConvertToDatabase(CourseSchema, db_course)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, updatedAt, ...updates } = convertTo(course)

  await db.update(db_course).set(updates).where(eq(db_course.id, course.id))
}

export async function updateCourseShareToken({ courseId, token }: { courseId: Course['id']; token: Course['share_key'] }) {
  const {
    user: { id: userId },
  } = await requireAuthentication()
  const db = await getDatabase()

  const result = await db
    .update(db_course)
    .set({ share_key: token })
    .where(and(eq(db_course.id, courseId), eq(db_course.owner_id, userId)))
  return result[0].affectedRows > 0
}
