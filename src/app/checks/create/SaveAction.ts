'use server'

import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { updateKnowledgeCheck } from '@/database/knowledgeCheck/update'
import { getServerSession } from '@/src/lib/auth/server'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import _ from 'lodash'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect, unauthorized } from 'next/navigation'

export async function saveAction({ user_id, check }: { user_id: string; check: KnowledgeCheck }) {
  const { user } = await getServerSession()
  if (!user) unauthorized()

  try {
    const exists = await getKnowledgeCheckById(check.id)
    if (exists) {
      if (!_.isEqual(exists, check)) {
        console.log(
          'Updating existing knowledge check -> changes',
          _.differenceWith(_.toPairs(exists), _.toPairs(check), _.isEqual).map(([key, value]) => ({ key, value })),
        )
        updateKnowledgeCheck(user.id, check)
      } else {
        console.log('Knowledge check is unchanged, skipping update')
      }
    } else {
      console.log('Inserting new knowledge check', check)
      await insertKnowledgeCheck(user_id, check)
    }

    redirect('/checks')
  } catch (err) {
    if (isRedirectError(err)) {
      throw err
    }
    console.error('Error saving knowledge check:', err)
  }
}
