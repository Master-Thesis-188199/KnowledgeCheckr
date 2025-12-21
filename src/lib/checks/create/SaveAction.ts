'use server'

import differenceWith from 'lodash/differenceWith'
import isEqual from 'lodash/isEqual'
import toPairs from 'lodash/toPairs'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { updateKnowledgeCheck } from '@/database/knowledgeCheck/update'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import _logger from '@/src/lib/log/Logger'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export async function saveAction({ check }: { check: KnowledgeCheck }) {
  const { user } = await requireAuthentication()

  try {
    const exists = await getKnowledgeCheckById(check.id)
    if (exists) {
      if (!isEqual(exists, check)) {
        logger.info(
          'Updating existing knowledge check -> changes',
          differenceWith(toPairs(exists), toPairs(check), isEqual).map(([key, value]) => ({ key, value })),
        )
        await updateKnowledgeCheck(user.id, check)
      } else {
        logger.info('Knowledge check is unchanged, skipping update')
      }
    } else {
      logger.info('Inserting new knowledge check', check)
      await insertKnowledgeCheck(user.id, check)
    }

    redirect('/checks')
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    logger.error('Error saving knowledge check:', err)
  }
}
