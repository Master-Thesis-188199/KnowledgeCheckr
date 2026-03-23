import type { CreateParams, FlattenLocale, LocaleKeys, LocaleValue, ParamsObject, ScopedValue, Scopes } from 'international-types'
import englishTranslations from './en'

type Translations = typeof englishTranslations

export type FlattenedTranslations = Translations extends Record<string, string> ? Translations : FlattenLocale<Translations>

type PluralSuffix = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
type PluralKey<Key extends string> = `${Key}#${PluralSuffix}`

type ValueAtPath<T, Path extends string> = Path extends `${infer Head}.${infer Rest}` ? (Head extends keyof T ? ValueAtPath<T[Head], Rest> : never) : Path extends keyof T ? T[Path] : never

export type TranslationKeys =
  Extract<keyof FlattenedTranslations, string> extends infer T ? (T extends Extract<keyof FlattenedTranslations, string> ? (T extends `${infer Head}#${PluralSuffix}` ? Head : T) : never) : never

export type TranslationScopes = Scopes<FlattenedTranslations>

export type ScopedTranslationKeys<Scope extends TranslationScopes> = LocaleKeys<FlattenedTranslations, Scope, Extract<keyof FlattenedTranslations, string>>

export type ScopedTranslations<Scope extends TranslationScopes> = ValueAtPath<Translations, Scope>

export type TranslationValue<Key extends TranslationKeys> = (PluralKey<Key> & keyof FlattenedTranslations extends never ? false : true) extends true
  ? FlattenedTranslations[PluralKey<Key> & keyof FlattenedTranslations]
  : FlattenedTranslations[Key]

type ScopedTranslationValue<Scope extends TranslationScopes, Key extends ScopedTranslationKeys<Scope>> = ScopedValue<FlattenedTranslations, Scope, Key>

export type Translator = <Key extends TranslationKeys, Value extends LocaleValue = TranslationValue<Key>>(
  key: Key,
  ...params: CreateParams<ParamsObject<Value>, FlattenedTranslations, undefined, Key, Value>
) => string

//@ts-expect-error Given the size of translation the type definition is very deep.
export type ScopedTranslator<Scope extends TranslationScopes> = <Key extends ScopedTranslationKeys<Scope>, Value extends LocaleValue = ScopedTranslationValue<Scope, Key>>(
  key: Key,
  ...params: CreateParams<ParamsObject<Value>, FlattenedTranslations, Scope, Key, Value>
) => string
