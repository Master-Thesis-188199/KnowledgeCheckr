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
