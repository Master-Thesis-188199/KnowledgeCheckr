'use server'

import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { updateKnowledgeCheck } from '@/database/knowledgeCheck/update'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import _ from 'lodash'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

export async function saveAction({ check }: { check: KnowledgeCheck }) {
  const { user } = await requireAuthentication()

  try {
    const exists = await getKnowledgeCheckById(check.id)
    if (exists) {
      if (!_.isEqual(exists, check)) {
        console.log(
          'Updating existing knowledge check -> changes',
          _.differenceWith(_.toPairs(exists), _.toPairs(check), _.isEqual).map(([key, value]) => ({ key, value })),
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
