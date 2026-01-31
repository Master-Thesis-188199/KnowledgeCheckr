import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import isExaminationAllowed from '@/src/lib/checks/[share_token]/isExaminationAllowed'

export default async function ClosedExaminationPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  const { user } = await requireAuthentication()

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) notFound()

  const t = await getScopedI18n('Examination.attempt_not_possible')

  const { reason } = await isExaminationAllowed(check, user)

  return (
    <>
      <PageHeading title={t('title')} />

      <p>{reason}</p>
    </>
  )
}
