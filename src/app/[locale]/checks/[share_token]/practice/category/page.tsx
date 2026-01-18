import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeCategorySelection } from '@/src/components/checks/[share_token]/practice/PracticeCategorySelection'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function PracticeCategoryPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <>
      <PageHeading title='Choose Category Questions' />
      <PracticeCategorySelection share_token={share_token} questions={check.questions.filter((q) => q.accessibility === 'all' || q.accessibility === 'practice-only')} />
    </>
  )
}
