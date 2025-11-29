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
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export async function saveAction({ check }: { check: KnowledgeCheck }) {
  const { user } = await requireAuthentication()

  try {
    const exists = await getKnowledgeCheckById(check.id)
    if (exists) {
      if (!isEqual(exists, check)) {
        console.log(
          'Updating existing knowledge check -> changes',
          differenceWith(toPairs(exists), toPairs(check), isEqual).map(([key, value]) => ({ key, value })),
        )
        await updateKnowledgeCheck(user.id, check)
      } else {
        console.log('Knowledge check is unchanged, skipping update')
      }
    } else {
      console.log('Inserting new knowledge check', check)
      await insertKnowledgeCheck(user.id, check)
    }

    redirect('/checks')
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    console.error('Error saving knowledge check:', err)
  }
}
