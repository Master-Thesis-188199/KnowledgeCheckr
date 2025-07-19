import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { ExaminationStoreProvider } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { notFound } from 'next/navigation'

export default async function ExaminationLayout({ children, params }: { children: React.ReactNode; params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return <ExaminationStoreProvider initialStoreProps={{ knowledgeCheck: check, currentQuestionIndex: 0 }}>{children}</ExaminationStoreProvider>
}
