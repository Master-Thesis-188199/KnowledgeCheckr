import { format } from 'date-fns'
import { differenceInMinutes } from 'date-fns/differenceInMinutes'
import { deAT, enUS } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns/setDefaultOptions'
import { EllipsisIcon } from 'lucide-react'
import { forbidden, notFound } from 'next/navigation'
import { getKnowledgeCheckExaminationAttempts } from '@/database/examination/select'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { DataTable } from '@/src/app/[locale]/checks/[share_token]/results/data-table'
import { Card, CardContent, CardHeader } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getCurrentLocale } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import hasCollaborativePermissions from '@/src/lib/checks/hasCollaborativePermissions'

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
  setDefaultOptions({ locale: currentLocale === 'en' ? enUS : deAT })

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

      <div className='mt-6 flex flex-col gap-16'>
        <div className='flex flex-col gap-8'>
          <div className='grid-container-3 mx-8'>
            <StatisticElement label='Attempts' value={userAttempts.length} title='User Attempts' />
            <StatisticElement
              label='Average Duration'
              value={getAverage(userAttempts.map((attempt) => differenceInMinutes(new Date(Date.parse(attempt.finishedAt)), new Date(Date.parse(attempt.startedAt))))) + 'm'}
            />

            <StatisticElement label='Attempts' value={userAttempts.length} />
          </div>

          <div className='grid-container-2'>
            <Card></Card>
            <Card></Card>
          </div>
        </div>

        <Card className='bg-background border-ring-subtle dark:border-ring-subtle p-0'>
          <CardHeader className='text-md grid-rows-1 rounded-t-md bg-neutral-200/60 px-4 py-2 font-medium dark:bg-neutral-700/60'>Examination Attempts</CardHeader>
          <CardContent className='my-0 px-4 py-0'>
            <DataTable columns={columns} data={data} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatisticElement({ label, value, title }: { label: string; value: React.ReactNode; title?: string }) {
  title ||= label

  return (
    <div className='ring-ring-subtle flex flex-col justify-center gap-2 rounded-md ring-1 dark:bg-neutral-800/70'>
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

const getAverage = (array: number[]) => array.reduce((sum, currentValue) => sum + currentValue, 0) / array.length
