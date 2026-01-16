'use server'

import { User } from 'better-auth'
import { db_category, db_knowledgeCheck } from '@/database/drizzle/schema'
import { getKnowledgeCheck } from '@/database/knowledgeCheck/query'
import { TableFilters } from '@/database/utils/buildWhere'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { KnowledgeCheckSettings } from '@/src/schemas/KnowledgeCheckSettingsSchema'
import { Question } from '@/src/schemas/QuestionSchema'

export async function getKnowledgeChecksByOwner(user_id: User['id'], { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
  await requireAuthentication()

  const checks = await getKnowledgeCheck({
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

export async function getKnowledgeCheckById(id: KnowledgeCheck['id']): Promise<KnowledgeCheck> {
  await requireAuthentication()

  const [check] = await getKnowledgeCheck({
    limit: 1,
    baseFilter: {
      id: {
        value: id,
        op: 'eq',
      },
    },
  })

  return check
}

export async function getKnowledgeCheckByShareToken(token: string) {
  const [check] = await getKnowledgeCheck({
    limit: 1,
    baseFilter: {
      share_key: {
        value: token,
        op: 'eq',
      },
    },
  })

  return check
}

function parseKnowledgeCheck(
  knowledgeCheck: typeof db_knowledgeCheck.$inferSelect,
  questions: Question[],
  settings: KnowledgeCheckSettings,
  categories: (typeof db_category.$inferSelect)[],
  collaborators: Array<string> = [],
): KnowledgeCheck {
  return {
    id: knowledgeCheck.id,
    name: knowledgeCheck.name,
    description: knowledgeCheck.description,
    share_key: knowledgeCheck.share_key,
    questions,
    difficulty: knowledgeCheck.difficulty,
    closeDate: knowledgeCheck.closeDate ? new Date(Date.parse(knowledgeCheck.closeDate)) : null,
    openDate: new Date(Date.parse(knowledgeCheck.openDate)),
    questionCategories: categories.map((c): KnowledgeCheck['questionCategories'][number] => ({
      id: c.id,
      name: c.name,
      skipOnMissingPrequisite: false,
      prequisiteCategoryId: c.prequisiteCategoryId ?? undefined,
    })),

    createdAt: new Date(Date.parse(knowledgeCheck.createdAt)),
    updatedAt: new Date(Date.parse(knowledgeCheck.updatedAt)),
    owner_id: knowledgeCheck.owner_id,
    collaborators,
    settings,
  }
}

export async function getPublicKnowledgeChecks({ limit = 10, offset = 0, filter }: { limit?: number; offset?: number; filter?: TableFilters<typeof db_knowledgeCheck> } = {}) {
  await requireAuthentication()

  const checks = await getKnowledgeCheck({
    limit,
    offset,
    baseFilter: filter,
  })

  return checks
}
