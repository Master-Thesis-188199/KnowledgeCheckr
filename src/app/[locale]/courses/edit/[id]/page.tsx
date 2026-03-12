import { forbidden, notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { ConfigureCourse } from '@/src/components/courses/ConfigureCourse'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await requireAuthentication()

  const check = await getCourseById(id)

  if (!check) {
    notFound()
  }

  const canEdit = check.owner_id === user.id || check.collaborators.includes(user.id)
  if (!canEdit) forbidden()

  return <ConfigureCourse mode='edit' initialStoreProps={check} options={{ cacheKey: 'check-exam-store', disableCache: true }} />
}
