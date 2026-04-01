import { notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { NextContentButton, PreviousContentButton } from '@/src/components/courses/contents/[courseId]/ContentNavigationButtons'
import { ContentProvider } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { ContentRenderer } from '@/src/components/courses/contents/[courseId]/ContentRenderer'
import { ContentPageBreadcrumbs } from '@/src/components/courses/contents/[courseId]/ContentsPageBreadcrumbs'
import { ContentSwitchButton } from '@/src/components/courses/contents/[courseId]/ContentSwitchButton'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'

export default async function CourseContentsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const t = await getScopedI18n('Courses.Contents')
  const { courseId } = await params
  const course = await getCourseById(courseId)

  if (!course) notFound()

  return (
    <>
      <ContentPageBreadcrumbs course={course} />
      <PageHeading title={t('title')} description={t('description')} />

      <ContentProvider initialProps={{ contents: course.contents }}>
        <div className='flex flex-1 gap-8'>
          <div className='flex flex-1 flex-col gap-6'>
            <ContentRenderer />
            <div className='flex justify-between'>
              <PreviousContentButton />
              <NextContentButton />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <h2 className='font-semibold'>{t('Navigation.title')}</h2>
            {course.contents.map((c) => (
              <ContentSwitchButton content={c} key={c.categoryId} />
            ))}
          </div>
        </div>
      </ContentProvider>
    </>
  )
}
