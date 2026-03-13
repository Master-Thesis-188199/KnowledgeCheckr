/* eslint-disable @typescript-eslint/no-unused-vars */
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

type MissingOptionsLastError<T extends Any> = T & {
  __error__: 'Function must have `Options` as its LAST parameter'
}

type IsOptionsLike<T> = [NonNullable<T>] extends [DatabaseOptions] ? true : false

// Validate last param (required or optional) is Options-like
export type RequireOptionsLast<F extends (...args: Any[]) => Any> =
  Parameters<F> extends [...infer _Head, infer Last]
    ? IsOptionsLike<NonNullable<Last>> extends true
      ? object // ok
      : MissingOptionsLastError<unknown>
    : MissingOptionsLastError<Any>
