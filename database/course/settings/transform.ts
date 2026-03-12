import 'server-only'
import { db_courseSettings } from '@/database/drizzle'
import _logger from '@/src/lib/log/Logger'
import { CourseSettings, CourseSettingsSchema, instantiateCourseSettings, safeParseCourseSettings } from '@/src/schemas/CourseSettingsSchema'
import createConvertToDatabase from '@/src/schemas/utils/createConvertToDatabase'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export function convertSettings(direction: 'to-database', settings: CourseSettings): Omit<typeof db_courseSettings.$inferInsert, 'knowledgecheckId'>
export function convertSettings(direction: 'from-database', settings: Omit<typeof db_courseSettings.$inferSelect, 'knowledgecheckId'> | null): CourseSettings | undefined
export function convertSettings(direction: 'to-database' | 'from-database', settings: CourseSettings | Omit<typeof db_courseSettings.$inferSelect, 'knowledgecheckId'> | null) {
  return direction === 'from-database' ? convertFromDatabase(settings as Any) : convertToDatabase(settings as Any)
}

function convertFromDatabase(settings: Omit<typeof db_courseSettings.$inferSelect, 'knowledgecheckId'> | null): CourseSettings | undefined {
  if (settings === null) {
    logger.warn('Check has not settings (null) returning instantiated settings object.')
    return instantiateCourseSettings()
  }

  const obj: CourseSettings = {
    ...settings,
    shareAccessibility: !!settings.shareAccessibility,
    examination: {
      allowAnonymous: !!settings.allowAnonymous,
      allowFreeNavigation: !!settings.allowFreeNavigation,
      answerOrder: settings.answerOrder,
      questionOrder: settings.questionOrder,
      examinationAttemptCount: settings.examinationAttemptCount,
      examTimeFrameSeconds: settings.examTimeFrameSeconds,
      enableExaminations: !!settings.enableExaminations,
      startDate: new Date(settings.startDate),
      endDate: settings.endDate ? new Date(settings.endDate) : null,
    },
    practice: {
      allowedPracticeCount: settings.allowedPracticeCount,
      enablePracticing: !!settings.enablePracticing,
    },
  }

  const parseResult = safeParseCourseSettings(obj)

  if (parseResult.error && settings !== null) logger.error('Failed to parse existing setting', settings, 'because of', parseResult.error)

  return parseResult.data
}

function convertToDatabase(settings: CourseSettings): Omit<typeof db_courseSettings.$inferInsert, 'knowledgecheckId'> {
  const convertToDatabase = createConvertToDatabase(CourseSettingsSchema, db_courseSettings)

  return convertToDatabase(settings)
}
