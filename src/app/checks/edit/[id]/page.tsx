import { forbidden, notFound } from 'next/navigation'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { ConfigureKnowledgeCheck } from '@/src/components/checks/ConfigureKnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await requireAuthentication()

  const check = await getKnowledgeCheckById(id)

  if (!check) {
    notFound()
  }

  const canEdit = check?.owner_id === user.id
  if (!canEdit) forbidden()

  return <ConfigureKnowledgeCheck mode='edit' initialStoreProps={check} options={{ cacheKey: 'check-exam-store', disableCache: true }} />
}
