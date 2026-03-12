import { notFound, redirect, RedirectType } from 'next/navigation'
import { getCourseByShareToken } from '@/database/course/select'
import { getKnowledgeCheckUserExaminationAttempts } from '@/database/examination/select'
import { ExaminationStoreProvider } from '@/src/components/courses/[share_token]/ExaminationStoreProvider'
import { ExamQuestionNavigationMenu } from '@/src/components/courses/[share_token]/ExamQuestionNavigationMenu'
import { ExamQuestionWrapper } from '@/src/components/courses/[share_token]/ExamQuestionWrapper'
import PageHeading from '@/src/components/Shared/PageHeading'
import { defaultExaminationStoreProps } from '@/src/hooks/courses/[share_token]/ExaminationStore'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import isExaminationAllowed from '@/src/lib/courses/[share_token]/isExaminationAllowed'
import prepareExaminationCheck from '@/src/lib/courses/[share_token]/prepareExminationCheck'

export default async function CheckPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  const { user } = await requireAuthentication()

  const check = await getCourseByShareToken(share_token)

  if (!check) {
    notFound()
  }

  const { allowed: examAllowed } = await isExaminationAllowed(check, user)

  if (!examAllowed) redirect(`/courses/${share_token}/attempt-not-possible`, RedirectType.replace)

  const [preparedCheck, attempts] = await Promise.all([prepareExaminationCheck(check), getKnowledgeCheckUserExaminationAttempts(user.id, check.id)])

  if (attempts.length >= check.settings.examination.examinationAttemptCount) {
    return redirect(`/courses/${share_token}/attempt-limit?attemptLimit=${check.settings.examination.examinationAttemptCount}`, RedirectType.replace)
  }

  return (
    <ExaminationStoreProvider initialStoreProps={{ ...defaultExaminationStoreProps, knowledgeCheck: preparedCheck, startedAt: new Date() }}>
      <PageHeading title={check.name ?? '<check-name>'} />

      <div className='grid gap-12 @3xl:grid-cols-[1fr_auto] @3xl:gap-[7vw]'>
        <ExamQuestionWrapper />
        <ExamQuestionNavigationMenu className='order-first @3xl:order-last' />
      </div>
    </ExaminationStoreProvider>
  )
}
