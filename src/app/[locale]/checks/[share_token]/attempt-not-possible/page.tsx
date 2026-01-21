import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getCurrentLocale, getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import isExaminationAllowed from '@/src/lib/checks/[share_token]/isExaminationAllowed'

export default async function ClosedExaminationPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  await requireAuthentication()

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) notFound()

  const currentLocale = await getCurrentLocale()
  const t = await getScopedI18n('Examination.attempt_not_possible')

  let message: string = t('unavailable')

  const allowance = isExaminationAllowed(check)

  if (allowance === 'examination window not yet open') message = t('notOpenYet', { openDate: check.settings.examination.startDate.toLocaleDateString(currentLocale) })
  if (allowance === 'examination window closed') message = t('checkClosed', { closeDate: check.settings.examination.endDate?.toLocaleDateString(currentLocale) })

  return (
    <>
      <PageHeading title={t('title')} />

      <p>{message}</p>
    </>
  )
}
