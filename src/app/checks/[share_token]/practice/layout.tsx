import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeStoreProvider } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'

export default async function PracticeLayout({
  children,
  params,
}: Readonly<{
  params: Promise<{ share_token: string }>
  children: React.ReactNode
}>) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  const unfilteredQuestions = check.questions.filter((q) => q.accessibility === 'all' || q.accessibility === 'practice-only')
  const categories = Array.from(new Set(unfilteredQuestions.map((q) => q.category)))

  // When there are no categories to switch between -> set (practice-) questions to be the base-questions.
  const practiceQuestions = categories.length > 1 ? [] : unfilteredQuestions

  return <PracticeStoreProvider initialStoreProps={{ unfilteredQuestions, practiceQuestions }}>{children}</PracticeStoreProvider>
}
