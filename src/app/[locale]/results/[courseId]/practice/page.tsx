import { notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { QuestionCorrectnessPieChart } from '@/src/components/charts/QuestionCorrectnessPieChart'
import { ExamQuestionDurationChart } from '@/src/components/charts/QuestionDurationChart'
import { QuestionScorePlotCard } from '@/src/components/charts/QuestionScorePlot'
import ExamQuestionResultTable from '@/src/components/courses/[share_token]/results/ExamQuestionResultTable'
import { PracticeResultsBreadcrumbs } from '@/src/components/results/practice/PracticeResultsBreadcrumbs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function PracticeResultsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const { user } = await requireAuthentication()

  const check = await getCourseById(courseId)

  if (!check) notFound()
  // todo verify that only the user that made a respective practice-attempt can view the attmept.
  // if (check) forbidden()

  const tExamResults = await getScopedI18n('Checks.ExaminatonResults')
  const t = await getScopedI18n('Checks.PracticeResults')

  return (
    <>
      <PracticeResultsBreadcrumbs share_token={check.share_key!} />
      <PageHeading title={t('title')} />

      <div className='mx-6 mt-2 flex flex-col gap-16'>
        <div className='mx-0 flex flex-col gap-16'>
          <div className='grid-container [--grid-column-count:3] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[360px]:[--grid-item-min-width:340px]'>
            <QuestionCorrectnessPieChart title={t('Charts.QuestionCorrectnessPieChart.title')} description={t('Charts.QuestionCorrectnessPieChart.description')} />
            <ExamQuestionDurationChart title={t('Charts.DurationChart.title')} description={tExamResults('Charts.ExamQuestionDurationChart.description')} />
          </div>

          <div className='grid-container [--grid-column-count:2] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[550px]:[--grid-item-min-width:500px]'>
            <QuestionScorePlotCard title={t('Charts.QuestionScorePlot.title')} description={t('Charts.QuestionScorePlot.description')} />
          </div>
        </div>

        <Card>
          <CardHeader className='-mt-6 flex flex-col items-stretch border-b bg-card pt-6 sm:flex-row'>
            <div className='flex flex-1 flex-col justify-center gap-1 pb-3 sm:pb-0'>
              <CardTitle>{t('Charts.DataTable.title')}</CardTitle>
              <CardDescription>{t('Charts.DataTable.description')}</CardDescription>
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
