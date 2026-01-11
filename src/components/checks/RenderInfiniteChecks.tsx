import { LoaderCircleIcon } from 'lucide-react'
import { KnowledgeCheckCard } from '@/src/components/checks/KnowledgeCheckCard'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

/**
 * This component renders a given set of (KnowledgeCheck) initialItems in a grid.
 * When the user scrolls to the bottom of the grid, new items will be fetched and appended using the `fetchNewItems` function.
 * @param props.initialItems The initial set of items that are usually fetched on the server that are to be shown.
 * @param props.fetchNewItems The function used to retrieve new items (on the client)
 */
export default function InfiniteKnowledgeCheckGrid({ initialItems, fetchNewItems }: { initialItems: KnowledgeCheck[]; fetchNewItems: InfinityScrollFetcherProps['getItems'] }) {
  return (
    <InfiniteScrollProvider initialItems={initialItems}>
      <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
        <InfinityScrollRenderer<KnowledgeCheck> component={KnowledgeCheckCard} />
      </div>
      <InfinityScrollFetcher getItems={fetchNewItems} enabled={initialItems.length > 0}>
        <div className='mt-8 flex justify-center gap-2'>
          <LoaderCircleIcon className='animate-spin' />
          Loading...
        </div>
      </InfinityScrollFetcher>
    </InfiniteScrollProvider>
  )
}
