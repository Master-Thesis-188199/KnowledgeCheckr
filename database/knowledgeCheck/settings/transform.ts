import 'server-only'
import { db_knowledgeCheckSettings } from '@/database/drizzle'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheckSettings, safeParseKnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export function convertSettings(direction: 'to-database', settings: KnowledgeCheckSettings): Omit<typeof db_knowledgeCheckSettings.$inferInsert, 'knowledgecheckId'>
export function convertSettings(direction: 'from-database', settings: Omit<typeof db_knowledgeCheckSettings.$inferSelect, 'knowledgecheckId'> | null): KnowledgeCheckSettings | undefined
export function convertSettings(direction: 'to-database' | 'from-database', settings: KnowledgeCheckSettings | Omit<typeof db_knowledgeCheckSettings.$inferSelect, 'knowledgecheckId'> | null) {
  return direction === 'from-database' ? convertFromDatabase(settings as Any) : convertToDatabase(settings as Any)
}

function convertFromDatabase(settings: Omit<typeof db_knowledgeCheckSettings.$inferSelect, 'knowledgecheckId'> | null): KnowledgeCheckSettings | undefined {
  const obj: KnowledgeCheckSettings = {
    ...settings,
    //@ts-expect-error Expect both structure and types to not align, e.g. booleans (1 | 0) are transformed by the schema
    examination: settings,
  }

  const parseResult = safeParseKnowledgeCheckSettings(obj)

  if (parseResult.error && settings !== null) logger.error('Failed to parse existing setting', settings, 'because of', parseResult.error)

  return parseResult.data
}

function convertToDatabase({ examination: examSettings, ...settings }: KnowledgeCheckSettings): Omit<typeof db_knowledgeCheckSettings.$inferInsert, 'knowledgecheckId'> {
  return {
    ...settings,
    ...examSettings,
    allowAnonymous: examSettings.allowAnonymous ? 1 : 0,
    allowFreeNavigation: examSettings.allowFreeNavigation ? 1 : 0,
    shareAccessibility: settings.shareAccessibility ? 1 : 0,
  }
}
