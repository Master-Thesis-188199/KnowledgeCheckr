import { notFound } from 'next/navigation'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { QuestionCorrectnessPieChart } from '@/src/components/charts/QuestionCorrectnessPieChart'
import { ExamQuestionDurationChart } from '@/src/components/charts/QuestionDurationChart'
import { QuestionScorePlotCard } from '@/src/components/charts/QuestionScorePlot'
import ExamQuestionResultTable from '@/src/components/checks/[share_token]/results/ExamQuestionResultTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function PracticeResultsPage({ params }: { params: Promise<{ checkId: string }> }) {
  const { checkId } = await params
  const { user } = await requireAuthentication()

  const check = await getKnowledgeCheckById(checkId)

  if (!check) notFound()
  // todo verify that only the user that made a respective practice-attempt can view the attmept.
  // if (check) forbidden()

  const t = await getScopedI18n('Checks.ExaminatonResults')

  return (
    <>
      <PageHeading title='Practice Attempt Results' />

      <div className='mx-6 mt-2 flex flex-col gap-16'>
        <div className='mx-0 flex flex-col gap-16'>
          <div className='grid-container [--grid-column-count:3] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[360px]:[--grid-item-min-width:340px]'>
            <QuestionCorrectnessPieChart title='Practice Performance' description='Shows the amount of questions that were answered in-, correctly or not at all.' />
            <ExamQuestionDurationChart title={'Question Time Difference'} description={t('Charts.ExamQuestionDurationChart.description')} />
          </div>

          <div className='grid-container [--grid-column-count:2] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[550px]:[--grid-item-min-width:500px]'>
            <QuestionScorePlotCard title='Performace Results per Question' description={'Shows the variance between the received question score and max-score by question'} />
          </div>
        </div>

        <Card>
          <CardHeader className='-mt-6 flex flex-col items-stretch border-b bg-card pt-6 sm:flex-row'>
            <div className='flex flex-1 flex-col justify-center gap-1 pb-3 sm:pb-0'>
              <CardTitle>{'Question Overivew'}</CardTitle>
              <CardDescription>{'Shows a detailed list of every question of this check to review your answers.'}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='mt-auto'>
            <ExamQuestionResultTable />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
