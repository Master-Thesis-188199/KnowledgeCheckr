import { FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import { KnowledgeCheckCard } from '@/src/components/checks/KnowledgeCheckCard'
import { Button } from '@/src/components/shadcn/button'
import { Input } from '@/src/components/shadcn/input'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function BrowseChecksPage() {
  const props: InfinityScrollFetcherProps<typeof getPublicKnowledgeChecks>['fetchProps'] = [
    {
      limit: 2,
    },
  ]

  const checks = await getPublicKnowledgeChecks.apply(null, props)

  return (
    <>
      <PageHeading title='Explore new Checks' />

      {checks.length === 0 && (
        <div className='flex gap-2'>
          No checks found. Create your own KnowledgeCheck
          <Link href='/checks/create' className='text-blue-500 underline dark:text-blue-500'>
            here
          </Link>
          .
        </div>
      )}
      <div className='mb-4 flex justify-between'>
        <Input placeholder='Search for a specific KnowledgeCheck by name' className='max-w-xl flex-1' />

        <div className='flex gap-4'>
          <Button variant='base'>
            <FilterIcon className='size-4' />
            Filter
          </Button>
          <Link href='/checks/create'>
            <Button>
              <PlusIcon className='size-5' />
              Create Check
            </Button>
          </Link>
        </div>
      </div>
      <InfiniteScrollProvider initialItems={checks}>
        <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
          <InfinityScrollRenderer<KnowledgeCheck> component={KnowledgeCheckCard} />
        </div>

        <InfinityScrollFetcher fetchItems={getPublicKnowledgeChecks} fetchProps={props} loadingLabel={'Loading more checks...'} />
      </InfiniteScrollProvider>
    </>
  )
}
