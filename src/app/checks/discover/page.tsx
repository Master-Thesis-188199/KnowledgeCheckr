import { FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import InfiniteKnowledgeCheckGrid from '@/src/components/checks/RenderInfiniteChecks'
import { Button } from '@/src/components/shadcn/button'
import { Input } from '@/src/components/shadcn/input'
import { InfinityScrollFetcherProps } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function BrowseChecksPage() {
  const filter: InfinityScrollFetcherProps<typeof getPublicKnowledgeChecks>['fetchProps'] = {
    limit: 1,
  }

  const checks = await getPublicKnowledgeChecks(filter)

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
      <InfiniteKnowledgeCheckGrid initialItems={[]} fetchItems={getPublicKnowledgeChecks} fetchProps={filter} />
    </>
  )
}
