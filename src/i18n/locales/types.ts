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

type ExtractPlaceholders<T extends string> = T extends `${string}{${infer Param}}${infer Rest}` ? Param | ExtractPlaceholders<Rest> : never

export type TranslationScopes = ScopeKeys<Translations>

export type TranslationKeys = LeafKeys<Translations>

type TranslationValue<Key extends TranslationKeys> = ValueAtPath<Translations, Key>

type TranslationParams<Value> = Value extends string ? ([ExtractPlaceholders<Value>] extends [never] ? never : { [K in ExtractPlaceholders<Value>]: string | number }) : never

type TranslationArgs<Value> = TranslationParams<Value> extends never ? [] : [params: TranslationParams<Value>]

export type Translator = <Key extends TranslationKeys>(key: Key, ...args: TranslationArgs<TranslationValue<Key>>) => string

export type ScopedTranslationKeys<Scope extends TranslationScopes> = LeafKeys<ValueAtPath<Translations, Scope>>

export type ScopedTranslations<Scope extends TranslationScopes> = ValueAtPath<Translations, Scope>

type ScopedTranslationValue<Scope extends TranslationScopes, Key extends ScopedTranslationKeys<Scope>> = ValueAtPath<ScopedTranslations<Scope>, Key>

export type ScopedTranslator<Scope extends TranslationScopes> = <Key extends ScopedTranslationKeys<Scope>>(key: Key, ...args: TranslationArgs<ScopedTranslationValue<Scope, Key>>) => string
