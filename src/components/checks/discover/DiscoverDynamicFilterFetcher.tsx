'use client'

import { getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import { useDiscoverFilterOptionsContext } from '@/src/components/checks/discover/DiscoverFilterOptionsProvider'
import { InfinityScrollFetcher } from '@/src/components/Shared/InfiniteScroll'

export default function DiscoverDynamicFilterFetcher() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setFuncProps: setFilter, ...filter } = useDiscoverFilterOptionsContext()
  return <InfinityScrollFetcher fetchItems={getPublicKnowledgeChecks} fetchProps={[filter]} loadingLabel={'Loading more checks...'} />
}
