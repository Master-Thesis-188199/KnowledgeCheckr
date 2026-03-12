import { KnowledgeCheckCard } from '@/src/components/courses/KnowledgeCheckCard'
import { InfiniteScrollProvider, InfinityScrollFetcher, InfinityScrollFetcherProps, InfinityScrollRenderer } from '@/src/components/Shared/InfiniteScroll'
import { Course } from '@/src/schemas/KnowledgeCheck'
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
  initialItems: Course[]
} & InfinityScrollFetcherProps<TFunc>) {
  return (
    <InfiniteScrollProvider initialItems={initialItems}>
      <div className='courses grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
        <InfinityScrollRenderer<Course> component={KnowledgeCheckCard} />
      </div>

      <InfinityScrollFetcher {...props} loadingLabel={'Loading more courses...'} />
    </InfiniteScrollProvider>
  )
}
