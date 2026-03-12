import { notFound } from 'next/navigation'
import { getCourseByShareToken } from '@/database/course/select'
import { PracticeCategorySelection } from '@/src/components/courses/[share_token]/practice/PracticeCategorySelection'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function PracticeCategoryPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const course = await getCourseByShareToken(share_token)

  if (!course) {
    notFound()
  }

  return (
    <>
      <PageHeading title='Choose Category Questions' />
      <PracticeCategorySelection share_token={share_token} questions={course.questions.filter((q) => q.accessibility === 'all' || q.accessibility === 'practice-only')} />
    </>
  )
}
