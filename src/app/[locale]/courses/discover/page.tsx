import Link from 'next/link'
import { getPublicCourses } from '@/database/course/select'
import { CourseCard } from '@/src/components/courses/CourseCard'
import DiscoverDynamicFilterFetcher from '@/src/components/courses/discover/DiscoverDynamicFilterFetcher'
import { DiscoverFilterFields } from '@/src/components/courses/discover/DiscoverFilterFields'
import DiscoverFilterOptionsContext from '@/src/components/courses/discover/DiscoverFilterOptionsProvider'
import { InfiniteScrollProvider, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import { Course } from '@/src/schemas/CourseSchema'

export default async function BrowseCoursesPage() {
  const t = await getScopedI18n('Courses.Discover')
  const props: InfinityScrollFetcherProps<typeof getPublicCourses>['fetchProps'] = [
    {
      limit: 10,
    },
  ]

  const courses = await getPublicCourses.apply(null, props)

  return (
    <DiscoverFilterOptionsContext defaultProps={props[0]}>
      <PageHeading title={t('title')} />

      {courses.length === 0 && (
        <div className='flex gap-2'>
          {t('no_courses_found_base')}
          <Link href='/courses/create' className='text-blue-500 underline dark:text-blue-500'>
            {t('no_courses_found_link')}
          </Link>
        </div>
      )}
      <DiscoverFilterFields />

      <InfiniteScrollProvider initialItems={courses}>
        <div className='courses grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
          <InfinityScrollRenderer<Course> component={CourseCard} />
        </div>

        <DiscoverDynamicFilterFetcher />
      </InfiniteScrollProvider>
    </DiscoverFilterOptionsContext>
  )
}
