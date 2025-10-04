import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { ExaminationStoreProvider } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { defaultExaminationStoreProps } from '@/src/hooks/checks/[share_token]/ExaminationStore'
import prepareExaminationCheck from '@/src/lib/checks/[share_token]/Examination'
import { notFound } from 'next/navigation'

export default async function ExaminationLayout({ children, params }: { children: React.ReactNode; params: Promise<{ share_token: string }> }) {
  const { share_token } = await params
  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <ExaminationStoreProvider initialStoreProps={{ ...defaultExaminationStoreProps, knowledgeCheck: prepareExaminationCheck(check), currentQuestionIndex: 1 % check.questions.length }}>
      {children}
    </ExaminationStoreProvider>
  )
}
