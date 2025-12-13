import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeProgress } from '@/src/components/checks/[share_token]/practice/PracticeProgress'
import { PracticeQuestionNavigation } from '@/src/components/checks/[share_token]/practice/PracticeQuestionNavigation'
import { PracticeStoreProvider } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { RenderPracticeQuestion } from '@/src/components/checks/[share_token]/practice/RenderPracticeQuestion'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function PracticePage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  const practiceQuestions = check.questions.filter((q) => q.accessibility === 'all' || q.accessibility === 'practice-only')

  return (
    <PracticeStoreProvider initialStoreProps={{ unfilteredQuestions: practiceQuestions }}>
      <PageHeading title='Practice' />

      <div className='mx-auto'>
        <PracticeQuestionNavigation />

        <PracticeProgress />

        <RenderPracticeQuestion />
      </div>
    </PracticeStoreProvider>
  )
}
