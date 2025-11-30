import { ConfigureKnowledgeCheck } from '@/src/components/checks/ConfigureKnowledgeCheck'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function CreateCheckPage() {
  await requireAuthentication()

  return <ConfigureKnowledgeCheck mode='create' />
}
