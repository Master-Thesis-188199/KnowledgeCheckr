import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import { KnowledgeCheckCard } from '@/src/components/check/KnowledgeCheckCard'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import Link from 'next/link'

export default async function ChecksPage() {
  const { user } = await requireAuthentication()
  const checks = await getKnowledgeChecksByOwner(user.id)

  return (
    <InfiniteScrollProvider initialItems={checks}>
      <div>
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
          {/* <InfinityScrollRenderer<KnowledgeCheck> render={(check, i) => <KnowledgeCheckCard key={i} {...check} />} /> */}
          <InfinityScrollRenderer<KnowledgeCheck> render={RenderCheck} component={KnowledgeCheckCard} />

          {/* {checks.map((check, i) => (
            <KnowledgeCheckCard key={i} {...check} />
          ))} */}
        </div>
        <InfinityScrollFetcher user_id={user.id} />
      </div>
    </InfiniteScrollProvider>
  )
}

async function RenderCheck(check: KnowledgeCheck, i: number, a: KnowledgeCheck[]) {
  'use server'
  return <KnowledgeCheckCard key={i} {...check} />
}
