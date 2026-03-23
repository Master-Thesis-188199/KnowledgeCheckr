/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable simple-import-sort/imports */
// cypress/support/i18n.ts
import messagesEn from '../../src/i18n/locales/en'
import messagesDe from '../../src/i18n/locales/de'
import { FlattenedTranslations, TranslationKeys, TranslationValue, Translator } from '@/src/i18n/locales/types'
import type { CreateParams, LocaleValue, ParamsObject } from 'international-types'
import { Any } from '@/types'

type Messages = Record<string, unknown>

function getByPath(obj: Messages, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (_, name) => {
    const value = params[name]
    return value == null ? `{${name}}` : String(value)
  })
}

/**
 * This utility function initializes a i18n translator function that may be used within tests to e.g. pass along to schema-utility functions
 * @param locale The language 'de' | 'en' that should be used, by default 'en'.
 * @returns The translator function that is identical to i18n's `t`.
 */
export function createTranslator(locale: 'de' | 'en' = 'en') {
  return function t<Key extends TranslationKeys, Value extends LocaleValue = TranslationValue<Key>>(
    key: Key,
    ...params: CreateParams<ParamsObject<Value>, FlattenedTranslations, undefined, Key, Value>
  ) {
    const value = getByPath(locale === 'de' ? messagesDe : messagesDe, key)

    if (typeof value !== 'string') {
      // fallback: return key
      return key
    }

    return interpolate(value, params as Any)
  }
}
