import { KnowledgeCheckCard } from '@/src/components/checks/KnowledgeCheckCard'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Any } from '@/types'

/**
 * This component renders a given set of (KnowledgeCheck) initialItems in a grid.
 * When the user scrolls to the bottom of the grid, new items will be fetched and appended using the `fetchNewItems` function.
 * @param props.initialItems The initial set of items that are usually fetched on the server that are to be shown.
 */
export default function InfiniteKnowledgeCheckGrid<TFunc extends (...args: Any) => Any>({
  initialItems,
  ...props
}: {
  initialItems: KnowledgeCheck[]
} & InfinityScrollFetcherProps<TFunc>) {
  return (
    <InfiniteScrollProvider initialItems={initialItems}>
      <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
        <InfinityScrollRenderer<KnowledgeCheck> component={KnowledgeCheckCard} />
      </div>

      <InfinityScrollFetcher {...props} loadingLabel={'Loading more checks...'} />
    </InfiniteScrollProvider>
  )
}
