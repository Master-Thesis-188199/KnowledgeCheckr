import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import { KnowledgeCheckCard } from '@/src/components/check/KnowledgeCheckCard'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import Link from 'next/link'

export default async function ChecksPage() {
  const { user } = await requireAuthentication()
  const checks = await getKnowledgeChecksByOwner(user.id, { limit: 10 })

  return (
    <main>
      <PageHeading title='Your Checks' />
      {checks.length === 0 && (
        <div>
          No checks found. Create a new one{' '}
          <Link href='/checks/create' className='text-blue-500 underline'>
            here
          </Link>
          .
        </div>
      )}
      <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
        {checks.map((check, i) => (
          <KnowledgeCheckCard key={i} {...check} />
        ))}
      </div>
    </main>
  )
}
