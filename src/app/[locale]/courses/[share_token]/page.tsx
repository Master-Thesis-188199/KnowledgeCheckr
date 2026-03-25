import { notFound, redirect, RedirectType } from 'next/navigation'
import { getCourseByShareToken } from '@/database/course/select'
import { getCourseUserExaminationAttempts } from '@/database/examination/select'
import { ExaminationStoreProvider } from '@/src/components/courses/[share_token]/ExaminationStoreProvider'
import { ExamQuestionNavigationMenu } from '@/src/components/courses/[share_token]/ExamQuestionNavigationMenu'
import { ExamQuestionWrapper } from '@/src/components/courses/[share_token]/ExamQuestionWrapper'
import PageHeading from '@/src/components/Shared/PageHeading'
import { defaultExaminationStoreProps } from '@/src/hooks/courses/[share_token]/ExaminationStore'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import isExaminationAllowed from '@/src/lib/courses/[share_token]/isExaminationAllowed'
import prepareExaminationCourse from '@/src/lib/courses/[share_token]/prepareExaminationCourse'

export default async function CoursePage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  const { user } = await requireAuthentication()

  const course = await getCourseByShareToken(share_token)

  if (!course) {
    notFound()
  }

  const { allowed: examAllowed } = await isExaminationAllowed(course, user)

  if (!examAllowed) redirect(`/courses/${share_token}/attempt-not-possible`, RedirectType.replace)

  const [preparedCourse, attempts] = await Promise.all([prepareExaminationCourse(course), getCourseUserExaminationAttempts(user.id, course.id)])

  if (attempts.length >= course.settings.examination.examinationAttemptCount) {
    return redirect(`/courses/${share_token}/attempt-limit?attemptLimit=${course.settings.examination.examinationAttemptCount}`, RedirectType.replace)
  }

  return (
    <ExaminationStoreProvider initialStoreProps={{ ...defaultExaminationStoreProps, course: preparedCourse, startedAt: new Date() }}>
      <PageHeading title={course.name ?? '<course-name>'} />

      <div className='grid gap-12 @3xl:grid-cols-[1fr_auto] @3xl:gap-[7vw]'>
        <ExamQuestionWrapper />
        <ExamQuestionNavigationMenu className='order-first @3xl:order-last' />
      </div>
    </ExaminationStoreProvider>
  )
}
