import Link from 'next/link'
import { getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import DiscoverDynamicFilterFetcher from '@/src/components/checks/discover/DiscoverDynamicFilterFetcher'
import { DiscoverFilterFields } from '@/src/components/checks/discover/DiscoverFilterFields'
import DiscoverFilterOptionsContext from '@/src/components/checks/discover/DiscoverFilterOptionsProvider'
import { KnowledgeCheckCard } from '@/src/components/checks/KnowledgeCheckCard'
import { InfiniteScrollProvider, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function BrowseChecksPage() {
  const t = await getScopedI18n('Checks.Discover')
  const props: InfinityScrollFetcherProps<typeof getPublicKnowledgeChecks>['fetchProps'] = [
    {
      limit: 10,
    },
  ]

  const checks = await getPublicKnowledgeChecks.apply(null, props)

  return (
    <DiscoverFilterOptionsContext defaultProps={props[0]}>
      <PageHeading title={t('title')} />

      {checks.length === 0 && (
        <div className='flex gap-2'>
          {t('no_checks_found_base')}
          <Link href='/checks/create' className='text-blue-500 underline dark:text-blue-500'>
            {t('no_checks_found_link')}
          </Link>
        </div>
      )}
      <DiscoverFilterFields />

      <InfiniteScrollProvider initialItems={checks}>
        <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
          <InfinityScrollRenderer<KnowledgeCheck> component={KnowledgeCheckCard} />
        </div>

        <DiscoverDynamicFilterFetcher />
      </InfiniteScrollProvider>
    </DiscoverFilterOptionsContext>
  )
}
