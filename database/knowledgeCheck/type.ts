import { getKnowledgeChecksByOwner, getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import { Any } from '@/types'

export interface DbKnowledgeCheck {
  id: string
  name: string
  description: string | null
  owner_id: string
  public_token: string | null
  openDate: string
  closeDate: string | null
  difficulty: number
  createdAt: string
  updatedAt: string
  expiresAt: string | null
}

export type DatabaseOptions = {
  limit?: number
  offset?: number
}

export type WithDatabaseOptions<Args extends Any[] = Any[], R = Any> = (...args: [...Args, DatabaseOptions]) => R

// Enforce: last param exists, is assignable to DatabaseOptions, and is NOT optional/undefined
export type EnforceLastDbOptions<TFunc extends (...args: Any[]) => Promise<Any>> =
  Parameters<TFunc> extends [...infer _Rest, infer Last]
    ? Last extends DatabaseOptions
      ? undefined extends Last
        ? never
        : TFunc // disallow `options?: ...` or `options: ... | undefined`
      : never
    : never

//* type enforcment tests

get(getPublicKnowledgeChecks)
get(getPublicOptions)
get(getPublic)
//@ts-expect-error Expect to detect missing options...
get(getPublicNoOptions)
get(getKnowledgeChecksByOwner)
get(getPublic3)
get(getPublicOptionalOptions)

type Options = { limit?: number; offset?: number }
type MissingOptionsLastError<T extends Any> = T & {
  __error__: 'Function must have `Options` as its LAST parameter'
}

type IsOptionsLike<T> = T extends { limit?: infer L; offset?: infer O } ? ([L] extends [number | undefined] ? ([O] extends [number | undefined] ? true : false) : false) : false

// Validate last param (required or optional) is Options-like
type RequireOptionsLast<F extends (...args: Any[]) => Any> =
  Parameters<F> extends [...infer _Head, infer Last]
    ? IsOptionsLike<NonNullable<Last>> extends true
      ? object // ok
      : MissingOptionsLastError<Parameters<F>>
    : MissingOptionsLastError<Any>

function get<F extends (...args: Any[]) => Any>(func: F & RequireOptionsLast<F>) {
  return (...args: Parameters<F>): ReturnType<F> => func(...args)
}
async function getPublicOptions({ limit = 10, offset = 0 }: DatabaseOptions) {
  return Promise.resolve({})
}
async function getPublicNoOptions(someValue: string) {
  return Promise.resolve({})
}
async function getPublicOptionalOptions(someValue: string, opt: DatabaseOptions = {}) {
  return Promise.resolve({})
}
async function getPublic(userId: string, { limit = 10, offset = 0 }: DatabaseOptions) {
  return Promise.resolve({})
}
async function getPublic3(userId: string, more: string, { limit = 10, offset = 0 }: DatabaseOptions) {
  return Promise.resolve({})
}
