import { forbidden, notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { ConfigureCourse } from '@/src/components/courses/ConfigureCourse'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await requireAuthentication()

  const course = await getCourseById(id)

  if (!course) {
    notFound()
  }

  const canEdit = course.owner_id === user.id || course.collaborators.includes(user.id)
  if (!canEdit) forbidden()

  return <ConfigureCourse mode='edit' initialStoreProps={course} options={{ cacheKey: 'course-exam-store', disableCache: true }} />
}
