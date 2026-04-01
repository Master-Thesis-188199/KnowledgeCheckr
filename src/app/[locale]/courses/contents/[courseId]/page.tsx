import { notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { NextContentButton, PreviousContentButton } from '@/src/components/courses/contents/[courseId]/ContentNavigationButtons'
import { ContentProvider } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { ContentRenderer } from '@/src/components/courses/contents/[courseId]/ContentRenderer'
import { ContentPageBreadcrumbs } from '@/src/components/courses/contents/[courseId]/ContentsPageBreadcrumbs'
import { ContentSwitchButton } from '@/src/components/courses/contents/[courseId]/ContentSwitchButton'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function CourseContentsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = await getCourseById(courseId)

  if (!course) notFound()

  return (
    <>
      <ContentPageBreadcrumbs course={course} />
      <PageHeading title='Course Contents' description='Read through the course contents to prepare for practice and examinations' />

      <ContentProvider initialProps={{ contents: course.contents }}>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='flex flex-1 gap-8'>
            <ContentRenderer />
            <div className='flex flex-col gap-2'>
              <h2 className='font-semibold'>Available Contents</h2>
              {course.contents.map((c) => (
                <ContentSwitchButton content={c} key={c.categoryId} />
              ))}
            </div>
          </div>

          <div className='flex justify-between'>
            <PreviousContentButton />
            <NextContentButton />
          </div>
        </div>
      </ContentProvider>
    </>
  )
}
