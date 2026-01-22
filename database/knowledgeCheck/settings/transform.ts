import 'server-only'
import { db_knowledgeCheckSettings } from '@/database/drizzle'
import _logger from '@/src/lib/log/Logger'
import { instantiateKnowledgeCheckSettings, KnowledgeCheckSettings, KnowledgeCheckSettingsSchema, safeParseKnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import createConvertToDatabase from '@/src/schemas/utils/createConvertToDatabase'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export function convertSettings(direction: 'to-database', settings: KnowledgeCheckSettings): Omit<typeof db_knowledgeCheckSettings.$inferInsert, 'knowledgecheckId'>
export function convertSettings(direction: 'from-database', settings: Omit<typeof db_knowledgeCheckSettings.$inferSelect, 'knowledgecheckId'> | null): KnowledgeCheckSettings | undefined
export function convertSettings(direction: 'to-database' | 'from-database', settings: KnowledgeCheckSettings | Omit<typeof db_knowledgeCheckSettings.$inferSelect, 'knowledgecheckId'> | null) {
  return direction === 'from-database' ? convertFromDatabase(settings as Any) : convertToDatabase(settings as Any)
}

function convertFromDatabase(settings: Omit<typeof db_knowledgeCheckSettings.$inferSelect, 'knowledgecheckId'> | null): KnowledgeCheckSettings | undefined {
  if (settings === null) {
    logger.warn('Check has not settings (null) returning instantiated settings object.')
    return instantiateKnowledgeCheckSettings()
  }

  const obj: KnowledgeCheckSettings = {
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

  const parseResult = safeParseKnowledgeCheckSettings(obj)

  if (parseResult.error && settings !== null) logger.error('Failed to parse existing setting', settings, 'because of', parseResult.error)

  return parseResult.data
}

function convertToDatabase(settings: KnowledgeCheckSettings): Omit<typeof db_knowledgeCheckSettings.$inferInsert, 'knowledgecheckId'> {
  const convertToDatabase = createConvertToDatabase(KnowledgeCheckSettingsSchema, db_knowledgeCheckSettings)

  return convertToDatabase(settings)
}
