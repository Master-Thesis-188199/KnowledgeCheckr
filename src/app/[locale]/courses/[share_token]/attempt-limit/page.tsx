import PageHeading from '@/src/components/Shared/PageHeading'

export default async function ExamAttemptLimitPage({ searchParams }: { searchParams: Promise<{ attemptLimit?: string }> }) {
  const { attemptLimit } = await searchParams

  return (
    <div>
      <PageHeading title='Limit reached' />
      You have reached the maximum amount of Examination attempts{attemptLimit !== undefined ? `, which is ${attemptLimit}.` : '.'}
    </div>
  )
}
