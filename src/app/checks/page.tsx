import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import { KnowledgeCheckCard } from '@/src/components/check/KnowledgeCheckCard'
import { getServerSession } from '@/src/lib/auth/server'
import Link from 'next/link'
import { unauthorized } from 'next/navigation'

export default async function ChecksPage() {
  const { user } = await getServerSession()

  if (!user) {
    unauthorized()
  }
  const checks = await getKnowledgeChecksByOwner(user.id, { limit: 10 })

  return (
    <main>
      <h1 className='mb-8 text-[22px] font-semibold tracking-wider'>Your Checks</h1>
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
