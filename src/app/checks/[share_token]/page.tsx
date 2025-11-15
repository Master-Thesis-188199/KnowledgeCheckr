import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { ExamQuestionWrapper } from '@/src/components/checks/[share_token]/ExamQuestionWrapper'
import { QuestionNavigationMenu } from '@/src/components/checks/[share_token]/QuestionNavigationMenu'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function CheckPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  await requireAuthentication()

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <>
      <PageHeading title={check.name ?? '<check-name>'} />

      <div className='grid gap-12 md:grid-cols-[1fr_auto] md:gap-[7vw]'>
        <ExamQuestionWrapper />
        <QuestionNavigationMenu className='order-first md:order-last' />
      </div>
    </>
  )
}
