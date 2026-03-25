import 'server-only'
import { db_courseSettings } from '@/database/drizzle'
import { Translator } from '@/src/i18n/locales/types'
import _logger from '@/src/lib/log/Logger'
import { CourseSettings, instantiateCourseSettings, safeParseCourseSettings } from '@/src/schemas/CourseSettingsSchema'
import convertToDatabase from '@/src/schemas/utils/convertToDatabase'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export function convertSettings(direction: 'to-database', settings: CourseSettings, t: Translator): Omit<typeof db_courseSettings.$inferInsert, 'knowledgecheckId'>
export function convertSettings(direction: 'from-database', settings: Omit<typeof db_courseSettings.$inferSelect, 'knowledgecheckId'> | null, t: Translator): CourseSettings | undefined
export function convertSettings(direction: 'to-database' | 'from-database', settings: CourseSettings | Omit<typeof db_courseSettings.$inferSelect, 'knowledgecheckId'> | null, t: Translator) {
  return direction === 'from-database' ? convertFromDatabase(settings as Any, t) : convertToDatabase(settings, db_courseSettings)
}

function convertFromDatabase(settings: Omit<typeof db_courseSettings.$inferSelect, 'knowledgecheckId'> | null, t: Translator): CourseSettings | undefined {
  if (settings === null) {
    logger.warn('Course has no settings (null) returning instantiated settings object.')
    return instantiateCourseSettings(t)
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

  const parseResult = safeParseCourseSettings(t, obj)

  if (parseResult.error && settings !== null) logger.error('Failed to parse existing setting', settings, 'because of', parseResult.error)

  return parseResult.data
}
