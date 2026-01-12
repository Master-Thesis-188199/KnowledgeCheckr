import { FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { getKnowledgeChecksByOwner, getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import { DatabaseOptions } from '@/database/knowledgeCheck/type'
import { KnowledgeCheckCard } from '@/src/components/checks/KnowledgeCheckCard'
import { Button } from '@/src/components/shadcn/button'
import { Input } from '@/src/components/shadcn/input'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import PageHeading from '@/src/components/Shared/PageHeading'
import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Any } from '@/types'

export default async function BrowseChecksPage() {
  get(getPublicOptions)
  get(getPublic)
  // get(getKnowledgeCheckSettingsById)
  get(getKnowledgeChecksByOwner)
  const props: InfinityScrollFetcherProps<typeof getPublicKnowledgeChecks>['fetchProps'] = undefined
  // {
  //   // limit: 1,
  //   // filter: {
  //   //   name: {
  //   //     value: '1',
  //   //     op: 'startsWith',
  //   //   },
  //   // },
  // }

  const checks = await getPublicKnowledgeChecks(props)

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

        <InfinityScrollFetcher fetchItems={getPublicKnowledgeChecks} loadingLabel={'Loading more checks...'} />
      </InfiniteScrollProvider>
    </>
  )
}

type Options = { limit?: number; offset?: number }
type MissingOptionsLastError<T extends (...args: Any[]) => Any> = T & {
  __error__: 'Function must have `Options` as its LAST parameter'
}

// Keep F only if its last parameter is Options
type HasOptionsLast<F extends (...args: Any[]) => Any> = Parameters<F> extends [...infer _Head, Options] ? F : MissingOptionsLastError<F>

function get<F extends (...args: Any[]) => Any>(func: HasOptionsLast<F>) {
  // optional: preserve the exact call signature
  return (...args: Parameters<F>): ReturnType<F> => func(...args)
}

async function getPublicOptions({ limit = 10, offset = 0 }: DatabaseOptions) {
  return Promise.resolve(instantiateKnowledgeCheck())
}
async function getPublic(userId: string, { limit = 10, offset = 0 }: DatabaseOptions) {
  return Promise.resolve(instantiateKnowledgeCheck())
}
