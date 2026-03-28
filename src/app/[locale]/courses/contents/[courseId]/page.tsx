import { notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
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

      <div className='flex flex-1 flex-col'>
        <div className='flex flex-1'>
          <ContentWrapper course={course} />
        </div>

        <div className='flex justify-between'>
          <Button variant='outline'>Go back</Button>
          <Button variant='primary'>Continue with</Button>
        </div>
      </div>
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
