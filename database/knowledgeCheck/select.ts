'use server'

import { User } from 'better-auth'
import { db_knowledgeCheck } from '@/database/drizzle/schema'
import { getKnowledgeChecks } from '@/database/knowledgeCheck/query'
import { TableFilters } from '@/database/utils/buildWhere'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function getKnowledgeChecksByOwner(user_id: User['id'], { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
  await requireAuthentication()

  const checks = await getKnowledgeChecks({
    limit,
    offset,
    baseFilter: {
      owner_id: {
        value: user_id,
        op: 'eq',
      },
    },
  })

  return checks
}

export async function getKnowledgeCheckById(id: KnowledgeCheck['id']) {
  await requireAuthentication()

  const checks = await getKnowledgeChecks({
    limit: 1,
    baseFilter: {
      id: {
        value: id,
        op: 'eq',
      },
    },
  })

  return checks.at(0)
}

export async function getKnowledgeCheckByShareToken(token: string) {
  const checks = await getKnowledgeChecks({
    limit: 1,
    baseFilter: {
      share_key: {
        value: token,
        op: 'eq',
      },
    },
  })

  return checks.at(0)
}

export async function getPublicKnowledgeChecks({ limit = 10, offset = 0, filter }: { limit?: number; offset?: number; filter?: TableFilters<typeof db_knowledgeCheck> } = {}) {
  await requireAuthentication()

  const checks = await getKnowledgeChecks({
    limit,
    offset,
    baseFilter: filter,
  })

  return checks
}
