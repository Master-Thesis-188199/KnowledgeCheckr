import { forbidden, notFound } from 'next/navigation'
import { getExaminationAttemptById } from '@/database/examination/select'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import hasCollaborativePermissions from '@/src/lib/checks/hasCollaborativePermissions'
import getDummyExamAttempts from '@/src/lib/dummy/getDummyExamAttempts'
import ExamQuestionResultTable from '../../../../../../components/checks/[share_token]/results/ExamQuestionResultTable'

export default async function ExamAttemptResultPage({ params }: { params: Promise<{ share_token: string; attemptId: string }> }) {
  const { share_token, attemptId } = await params
  const { user } = await requireAuthentication()

  let [check, attempt] = await Promise.all([getKnowledgeCheckByShareToken(share_token), getExaminationAttemptById(parseInt(attemptId))])

  // dummy examinationAttempt data when a given attempt does not exist
  if (!attempt) attempt = (await getDummyExamAttempts(1))[0]

  if (!check || !attempt) notFound()
  if (!hasCollaborativePermissions(check, user.id)) forbidden()

  return (
    <>
      <PageHeading title='Examination Attempt Results' description={`Shows all the details of the a given examination attempt of ${attempt.user.name}`} />

      <div className='flex flex-col gap-14'>
        <QuestionScoresLineChart />
        <ExamQuestionResultTable />
      </div>
    </>
  )
}
