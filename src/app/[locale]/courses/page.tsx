import Link from 'next/link'
import { getCoursesByOwner } from '@/database/course/select'
import InfiniteCourseGrid from '@/src/components/courses/RenderInfiniteCourses'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function CoursesPage() {
  const { user } = await requireAuthentication()
  const courses = await getCoursesByOwner(user.id)

  const t = await getScopedI18n('Courses')

  return (
    <>
      <PageHeading title={t('title')} />
      {courses.length === 0 && (
        <div className='flex gap-2'>
          {t('no_existing_courses')}
          <Link href='/courses/create' className='text-blue-500 underline dark:text-blue-500'>
            {t('no_existing_courses_action_button')}
          </Link>
        </div>
      )}

      <InfiniteCourseGrid initialItems={courses} fetchItems={getCoursesByOwner} fetchProps={[user.id, { limit: 10 }]} />
    </>
  )
}
