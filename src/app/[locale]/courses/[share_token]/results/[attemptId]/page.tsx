import { forbidden, notFound } from 'next/navigation'
import { getCourseByShareToken } from '@/database/course/select'
import { getExaminationAttemptById } from '@/database/examination/select'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import hasCollaborativePermissions from '@/src/lib/courses/hasCollaborativePermissions'
import getDummyExamAttempts from '@/src/lib/dummy/getDummyExamAttempts'
import ExamQuestionResultTable from '../../../../../../components/courses/[share_token]/results/ExamQuestionResultTable'

export default async function ExamAttemptResultPage({ params }: { params: Promise<{ share_token: string; attemptId: string }> }) {
  const t = await getScopedI18n('Courses.ExaminatonResults.ExamAttemptResultPage')
  const { share_token, attemptId } = await params
  const { user } = await requireAuthentication()

  let [course, attempt] = await Promise.all([getCourseByShareToken(share_token), getExaminationAttemptById(parseInt(attemptId))])

  // dummy examinationAttempt data when a given attempt does not exist
  if (!attempt) attempt = (await getDummyExamAttempts(1))[0]

  if (!course || !attempt) notFound()
  if (!hasCollaborativePermissions(course, user.id)) forbidden()

  return (
    <>
      <PageHeading title={t('title')} description={t('description', { name: attempt.user.name })} />

      <div className='flex flex-col gap-14'>
        <QuestionScoresLineChart />
        <ExamQuestionResultTable />
      </div>
    </>
  )
}
