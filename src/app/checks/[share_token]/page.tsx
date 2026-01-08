import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { ExaminationStoreProvider } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { ExamQuestionWrapper } from '@/src/components/checks/[share_token]/ExamQuestionWrapper'
import { QuestionNavigationMenu } from '@/src/components/checks/[share_token]/QuestionNavigationMenu'
import PageHeading from '@/src/components/Shared/PageHeading'
import { defaultExaminationStoreProps } from '@/src/hooks/checks/[share_token]/ExaminationStore'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import prepareExaminationCheck from '@/src/lib/checks/[share_token]/prepareExminationCheck'

export default async function CheckPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  await requireAuthentication()

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  const preparedCheck = await prepareExaminationCheck(check)

  return (
    <ExaminationStoreProvider initialStoreProps={{ ...defaultExaminationStoreProps, knowledgeCheck: preparedCheck, startedAt: new Date() }}>
      <PageHeading title={check.name ?? '<check-name>'} />

      <div className='grid gap-12 @3xl:grid-cols-[1fr_auto] @3xl:gap-[7vw]'>
        <ExamQuestionWrapper />
        <QuestionNavigationMenu className='order-first @3xl:order-last' />
      </div>
    </ExaminationStoreProvider>
  )
}
