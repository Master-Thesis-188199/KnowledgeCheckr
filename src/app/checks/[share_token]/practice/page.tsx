import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeProgress } from '@/src/components/checks/[share_token]/practice/PracticeProgress'
import { PracticeQuestionNavigation } from '@/src/components/checks/[share_token]/practice/PracticeQuestionNavigation'
import { RenderPracticeQuestion } from '@/src/components/checks/[share_token]/practice/RenderPracticeQuestion'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function PracticePage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <>
      <PageHeading title='Practice' />

      <div className='mx-auto'>
        <PracticeQuestionNavigation />

        <PracticeProgress />

        <RenderPracticeQuestion />
      </div>
    </>
  )
}
