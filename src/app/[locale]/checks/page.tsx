import Link from 'next/link'
import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import InfiniteKnowledgeCheckGrid from '@/src/components/checks/RenderInfiniteChecks'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function ChecksPage() {
  const { user } = await requireAuthentication()
  const checks = await getKnowledgeChecksByOwner(user.id)

  const t = await getScopedI18n('Checks')

  return (
    <>
      <PageHeading title={t('title')} />
      {checks.length === 0 && (
        <div className='flex gap-2'>
          {t('no_existing_checks')}
          <Link href='/checks/create' className='text-blue-500 underline dark:text-blue-500'>
            {t('no_existing_checks_action_button')}
          </Link>
        </div>
      )}

      <InfiniteKnowledgeCheckGrid initialItems={checks} fetchItems={getKnowledgeChecksByOwner} fetchProps={[user.id, { limit: 10 }]} />
    </>
  )
}
