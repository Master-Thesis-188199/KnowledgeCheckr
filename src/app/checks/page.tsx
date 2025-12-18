import { LoaderCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import { KnowledgeCheckCard } from '@/src/components/checks/KnowledgeCheckCard'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

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
          <InfinityScrollRenderer<KnowledgeCheck> component={KnowledgeCheckCard} />
        </div>
        <InfinityScrollFetcher getItems={fetchItems}>
          <div className='mt-8 flex justify-center gap-2'>
            <LoaderCircleIcon className='animate-spin' />
            Loading...
          </div>
        </InfinityScrollFetcher>
      </div>
    </InfiniteScrollProvider>
  )
}

async function fetchItems(offset: number) {
  'use server'
  const { user } = await requireAuthentication()

  return await getKnowledgeChecksByOwner(user.id, { offset })
}
