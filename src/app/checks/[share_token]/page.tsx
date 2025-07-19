import DisplayQuestion from '@/components/check/DisplayQuestion'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { QuestionNavigationMenu } from '@/src/components/checks/[share_token]/QuestionNavigationMenu'
import PageHeading from '@/src/components/Shared/PageHeading'
import { notFound } from 'next/navigation'

export default async function CheckPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <>
      <PageHeading title={check.name ?? '<check-name>'} />

      <div className='grid grid-cols-[1fr_auto] gap-12'>
        <div className='mx-auto max-h-fit w-full max-w-7xl'>{check.questions && <DisplayQuestion {...check.questions.at(0)!} />}</div>
        <QuestionNavigationMenu />
      </div>
    </>
  )
}
