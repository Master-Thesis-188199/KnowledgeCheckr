'use server'

import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import toPairs from 'lodash/toPairs'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import insertCourse from '@/database/course/insert'
import { getCourseById } from '@/database/course/select'
import { updateCourse } from '@/database/course/update'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { Course } from '@/src/schemas/CourseSchema'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export type LodashDifferences<T> = {
  [K in keyof T]-?: { key: K; value: T[K] }
}[keyof T][]

export async function saveAction({ check: modifiedCheck, callbackPath }: { check: Course; callbackPath: string }) {
  await requireAuthentication()

  try {
    const originCheck = await getCourseById(modifiedCheck.id)
    if (originCheck) {
      if (!isEqual(originCheck, modifiedCheck)) {
        const changes = differenceWith(toPairs(modifiedCheck), toPairs(originCheck), isEqual).map(([key, value]) => ({ key, value })) as LodashDifferences<Course>

        logger.info('Updating existing knowledge check -> changes', changes)
        await updateCourse(modifiedCheck, changes)
      } else {
        logger.info('Knowledge check is unchanged, skipping update')
      }
    } else {
      logger.info('Inserting new knowledge check', modifiedCheck)
      await insertCourse(modifiedCheck)
    }

    redirect(callbackPath)
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    logger.error('Error saving knowledge check:', err)
  }
}
