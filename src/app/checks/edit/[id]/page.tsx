import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { ConfigureKnowledgeCheck } from '@/src/components/checks/ConfigureKnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { notFound } from 'next/navigation'

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireAuthentication()

  const check = await getKnowledgeCheckById(id)

  if (!check) {
    notFound()
  }

  return <ConfigureKnowledgeCheck mode='edit' initialStoreProps={check} options={{ cacheKey: 'check-exam-store', disableCache: true }} />
}
