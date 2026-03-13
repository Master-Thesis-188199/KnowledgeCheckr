'use client'

import { getPublicCourses } from '@/database/course/select'
import { useDiscoverFilterOptionsContext } from '@/src/components/courses/discover/DiscoverFilterOptionsProvider'
import { InfinityScrollFetcher } from '@/src/components/Shared/InfiniteScroll'

export default function DiscoverDynamicFilterFetcher() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setFuncProps: setFilter, ...filter } = useDiscoverFilterOptionsContext()
  return <InfinityScrollFetcher fetchItems={getPublicCourses} fetchProps={[filter]} loadingLabel={'Loading more courses...'} />
}
