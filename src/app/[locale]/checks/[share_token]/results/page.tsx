'use server'

import { format } from 'date-fns'
import { differenceInMinutes } from 'date-fns/differenceInMinutes'
import { deAT, enUS } from 'date-fns/locale'
import { EllipsisIcon } from 'lucide-react'
import { forbidden, notFound } from 'next/navigation'
import { getKnowledgeCheckExaminationAttempts } from '@/database/examination/select'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { ChartAreaInteractive } from '@/src/app/[locale]/checks/[share_token]/results/chart-area-interactive'
import { ShadcnDataTable } from '@/src/app/[locale]/checks/[share_token]/results/shadcn-table'
import { ExaminationSuccessPieChart } from '@/src/components/charts/ExaminationSuccessPieChart'
import { ExamQuestionDurationChart } from '@/src/components/charts/QuestionDurationChart'
import { UserTypePieChart } from '@/src/components/charts/UserTypePieChart'
import { Card, CardContent, CardHeader } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getCurrentLocale } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import hasCollaborativePermissions from '@/src/lib/checks/hasCollaborativePermissions'
import { cn } from '@/src/lib/Shared/utils'
import shadcnData from './data.json'

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

  const userAttempts = await getKnowledgeCheckExaminationAttempts(check.id, { limit: 4 })

  const currentLocale = await getCurrentLocale()

  const data = userAttempts.map(
    (attempt): ExaminationAttemptTableStructure => ({
      startedAt: format(new Date(Date.parse(attempt.startedAt)), 'P', { locale: currentLocale === 'en' ? enUS : deAT }),
      userName: attempt.user.name,
      duration: differenceInMinutes(new Date(Date.parse(attempt.finishedAt)), new Date(Date.parse(attempt.startedAt))),
      score: attempt.score,
      type: attempt.type,
      userAvatar: attempt.user.image ?? undefined,
      answerCount: attempt.results.length,
    }),
  )

  return (
    <>
      <PageHeading title='Examination Results' description='Look at the examination attempts of users.' />

      <div className='mx-6 mt-2 flex flex-col gap-16'>
        <div className='mx-0 flex flex-col gap-16'>
          <div className='grid-container [--grid-column-count:3] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[360px]:[--grid-item-min-width:340px]'>
            <UserTypePieChart title='Examinations by User types' description='Shows examination attempts by user type' />
            <ExamQuestionDurationChart title='Average Question time differences' description='Shows the variance in actual and estimated answer-time ' />
            <ExaminationSuccessPieChart title='Examinations Success Rate' description='Shows how many users have passed / failed.' />
          </div>

          <div className='grid-container [--grid-column-count:2] [--grid-desired-gap:70px] [--grid-item-min-width:280px] @[550px]:[--grid-item-min-width:500px]'>
            <ChartAreaInteractive />
            <ChartAreaInteractive />
          </div>
        </div>

        <Card className='bg-background border-ring-subtle dark:border-ring-subtle p-0'>
          <CardHeader className='text-md grid-rows-1 rounded-t-md bg-neutral-200/60 px-4 py-2 font-medium dark:bg-neutral-700/60'>Examination Attempts</CardHeader>
          <CardContent className='my-0 px-0 py-0 pb-8'>
            <ShadcnDataTable data={shadcnData} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatisticElement({ label, value, title, className }: { label: string; value: React.ReactNode; title?: string; className?: string }) {
  title ||= label

  return (
    <div className={cn('ring-ring-subtle flex flex-col justify-center gap-2 rounded-md ring-1 dark:bg-neutral-800/70', className)}>
      {title && (
        <h3 className='bg-input border-b-input-ring flex justify-between rounded-t-md border-b px-3 py-1.5 text-sm font-medium dark:text-neutral-300/80'>
          {title}

          <EllipsisIcon className='' />
        </h3>
      )}
      <div className='flex flex-col items-center gap-1 p-4'>
        <dt className='text-sm text-neutral-500 dark:text-neutral-400'>{label}</dt>
        <dd className='order-first text-lg font-semibold tracking-tight text-neutral-600/90 dark:text-neutral-300'>{value}</dd>
      </div>
    </div>
  )
}
