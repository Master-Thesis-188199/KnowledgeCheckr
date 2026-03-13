import { notFound } from 'next/navigation'
import { getCourseByShareToken } from '@/database/course/select'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function PracticeNotAllowedPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  await requireAuthentication()

  const course = await getCourseByShareToken(share_token)

  if (!course) notFound()

  const t = await getScopedI18n('Practice.practicing_not_allowed')

  const message: string = t('disabled')

  return (
    <>
      <PageHeading title={t('title')} />

      <p>{message}</p>
    </>
  )
}
