'use server'

import { forbidden, notFound } from 'next/navigation'
import { getKnowledgeCheckExaminationAttempts } from '@/database/examination/select'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { ExaminationSuccessPieChart } from '@/src/components/charts/ExaminationSuccessPieChart'
import { ExamQuestionDurationChart } from '@/src/components/charts/QuestionDurationChart'
import { QuestionScoresLineChartCard } from '@/src/components/charts/QuestionScoresLineChart'
import { UserTypePieChart } from '@/src/components/charts/UserTypePieChart'
import { ExaminationAttemptTable } from '@/src/components/checks/[share_token]/ExaminationAttemptTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import hasCollaborativePermissions from '@/src/lib/checks/hasCollaborativePermissions'
import getDummyExamAttempts from '@/src/lib/dummy/getDummyExamAttempts'

type ExaminationAttmept = Awaited<ReturnType<typeof getKnowledgeCheckExaminationAttempts>>[number]
export type ExaminationAttemptTableStructure = Pick<ExaminationAttmept, 'score' | 'type'> & {
  startedAt: string
  duration: number
  userName: string
  userAvatar?: string
  answerCount: number
}

export default async function ExaminationResultsPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  const { user } = await requireAuthentication()

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) notFound()
  if (!hasCollaborativePermissions(check, user.id)) forbidden()

  const dummyAttempts = await getDummyExamAttempts(50)
  const t = await getScopedI18n('Checks.ExaminatonResults')

  return (
    <>
      <PageHeading title={t('title')} description={t('description')} />

      <div className='mx-6 mt-2 flex flex-col gap-16'>
        <div className='mx-0 flex flex-col gap-16'>
          <div className='grid-container [--grid-column-count:3] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[360px]:[--grid-item-min-width:340px]'>
            <UserTypePieChart title={t('Charts.UserTypePieChart.title')} description={t('Charts.UserTypePieChart.description')} />
            <ExamQuestionDurationChart title={t('Charts.ExamQuestionDurationChart.title')} description={t('Charts.ExamQuestionDurationChart.description')} />
            <ExaminationSuccessPieChart title={t('Charts.ExaminationSuccessPieChart.title')} description={t('Charts.ExaminationSuccessPieChart.description')} />
          </div>

          <div className='grid-container [--grid-column-count:2] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[550px]:[--grid-item-min-width:500px]'>
            <QuestionScoresLineChartCard title={t('Charts.QuestionScoresLineChartCard.title')} description={t('Charts.QuestionScoresLineChartCard.description')} />
          </div>
        </div>

        <Card>
          <CardHeader className='-mt-6 flex flex-col items-stretch border-b bg-card pt-6 sm:flex-row'>
            <div className='flex flex-1 flex-col justify-center gap-1 pb-3 sm:pb-0'>
              <CardTitle>{t('ExaminationAttemptTable.title')}</CardTitle>
              <CardDescription>{t('ExaminationAttemptTable.description')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='mt-auto'>
            <ExaminationAttemptTable
              data={dummyAttempts.map((attempt, i) => ({
                id: attempt.id,
                score: attempt.score,
                startedAt: new Date(Date.parse(attempt.startedAt)),
                finishedAt: new Date(Date.parse(attempt.finishedAt)),
                status: i % 4 !== 0 ? t('ExaminationAttemptTable.status_done') : t('ExaminationAttemptTable.status_in_progress'),
                totalCheckScore: 100,
                type: i % 5 !== 0 ? t('ExaminationAttemptTable.user_type_normal') : t('ExaminationAttemptTable.user_type_anonynmous'),
                username: attempt.user.name,
              }))}
            />
          </CardContent>
        </Card>

        {/* <Card className='bg-background border-ring-subtle dark:border-ring-subtle p-0'>
          <CardHeader className='text-md grid-rows-1 rounded-t-md bg-neutral-200/60 px-4 py-2 font-medium dark:bg-neutral-700/60'>Examination Attempts</CardHeader>
          <CardContent className='my-0 flex flex-col gap-6 px-0 py-0 pb-8'>
            <ExaminationAttemptTable
              data={dummyAttempts.map((attempt, i) => ({
                id: attempt.id,
                score: attempt.score,
                startedAt: new Date(Date.parse(attempt.startedAt)),
                finishedAt: new Date(Date.parse(attempt.finishedAt)),
                status: i % 4 !== 0 ? 'Done' : 'in-progress',
                totalCheckScore: 100,
                type: i % 5 !== 0 ? 'normal' : 'anonymous',
                username: attempt.user.name,
              }))}
            />
          </CardContent>
        </Card> */}
      </div>
    </>
  )
}
