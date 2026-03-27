import { forbidden, notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { getExaminationAttemptById } from '@/database/examination/select'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import ExamQuestionResultTable from '@/src/components/results/examination/ExamQuestionResultTable'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import hasCollaborativePermissions from '@/src/lib/courses/hasCollaborativePermissions'
import getDummyExamAttempts from '@/src/lib/dummy/getDummyExamAttempts'

export default async function ExamAttemptResultPage({ params }: { params: Promise<{ courseId: string; attemptId: string }> }) {
  const t = await getScopedI18n('Courses.ExaminatonResults.ExamAttemptResultPage')
  const { courseId, attemptId } = await params
  const { user } = await requireAuthentication()

  let [course, attempt] = await Promise.all([getCourseById(courseId), getExaminationAttemptById(parseInt(attemptId))])

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
