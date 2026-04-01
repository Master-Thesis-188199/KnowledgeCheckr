import { notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { ContentProvider } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { ContentSwitchButton } from '@/src/components/courses/contents/[courseId]/ContentSwitchButton'
import { Button } from '@/src/components/shadcn/button'
import PageHeading from '@/src/components/Shared/PageHeading'
import { RichTextEditor } from '@/src/components/tiptap-examples/RichTextEditor'
import { cn } from '@/src/lib/Shared/utils'
import { Course } from '@/src/schemas/CourseSchema'

export default async function CourseContentsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = await getCourseById(courseId)

  if (!course) notFound()

  return (
    <>
      <PageHeading title='Course Contents' description='Read through the course contents to prepare for practice and examinations' />

      <ContentProvider initialProps={{ contents: course.contents }}>
        <div className='flex flex-1 flex-col gap-6'>
          <div className='flex flex-1 gap-8'>
            <ContentWrapper course={course} />
            <div className='flex flex-col gap-2'>
              <h2 className='font-semibold'>Available Contents</h2>
              {course.contents.map((c) => (
                <ContentSwitchButton content={c} key={c.categoryId} />
              ))}
            </div>
          </div>

          <div className='flex justify-between'>
            <Button variant='outline'>Go back</Button>
            <Button variant='primary'>Continue with</Button>
          </div>
        </div>
      </ContentProvider>
    </>
  )
}

function ContentWrapper({ course }: { course: Course }) {
  if (course.contents.length === 0 || !course.contents[0].content) return <>Course has no contents...</>

  return (
    <>
      <RichTextEditor readOnly defaultContent={course.contents[0].content} editorPaneClassname={cn('border-dashed p-4')} />
    </>
  )
}
