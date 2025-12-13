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

  const practiceQuestions = check.questions.filter((q) => q.accessibility === 'all' || q.accessibility === 'practice-only')
  return <PracticeStoreProvider initialStoreProps={{ unfilteredQuestions: practiceQuestions }}>{children}</PracticeStoreProvider>
}
