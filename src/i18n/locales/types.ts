import { Any } from '@/types'
import englishTranslations from './en'

type Translations = typeof englishTranslations

type Primitive = string | number | boolean | bigint | symbol | null | undefined

type Join<K extends string, P extends string> = `${K}.${P}`

type LeafKeys<T> = T extends Primitive
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends Primitive ? K : Join<K, LeafKeys<T[K]>>
    }[Extract<keyof T, string>]

type ScopeKeys<T> = T extends Primitive
  ? never
  : {
      [K in Extract<keyof T, string>]: T[K] extends Primitive ? never : K | Join<K, ScopeKeys<T[K]>>
    }[Extract<keyof T, string>]

type ValueAtPath<T, Path extends string> = Path extends `${infer Head}.${infer Rest}` ? (Head extends keyof T ? ValueAtPath<T[Head], Rest> : never) : Path extends keyof T ? T[Path] : never

export type TranslationScopes = ScopeKeys<Translations>

export type TranslationKeys = LeafKeys<Translations>

export type ScopedTranslationKeys<Scope extends TranslationScopes> = LeafKeys<ValueAtPath<Translations, Scope>>

export type ScopedTranslations<Scope extends TranslationScopes> = ValueAtPath<Translations, Scope>

export type ScopedTranslator<Scope extends TranslationScopes> = (key: ScopedTranslationKeys<Scope>, ...args: unknown[]) => string
export type Translator = (key: TranslationKeys, ...args: Any[]) => string
