import { EllipsisIcon, Share2Icon } from 'lucide-react'
import { Button } from '@/src/components/shadcn/button'
import { Skeleton } from '@/src/components/shadcn/skeleton'
import { GenericBreadcrumb } from '@/src/components/Shared/Breadcrumb/GenericBreadcrumb'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { cn } from '@/src/lib/Shared/utils'

export default async function LoadingChecksPage() {
  await requireAuthentication()
  const dummyChecks = Array.from({ length: 10 })

  return (
    <div>
      <GenericBreadcrumb />
      <PageHeading title='Your Checks' showBreadcrumbs={false} />

      <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
        {dummyChecks.map((_, i) => (
          <KnowledgeCheckCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function KnowledgeCheckCardSkeleton() {
  return (
    <Card disableInteractions className='group relative flex h-[329px] flex-col justify-between gap-10'>
      <div className='absolute top-3 right-4 flex gap-1'>
        <button
          disabled
          aria-label='share KnowledgeCheck'
          className={cn(
            'group rounded-md p-1.5 text-neutral-600 ring-neutral-400 enabled:hover:cursor-pointer enabled:hover:ring-1 disabled:cursor-not-allowed disabled:text-neutral-400 dark:text-neutral-400 dark:ring-neutral-500 disabled:dark:text-neutral-500',
          )}>
          <Share2Icon className='size-4.5 group-active:stroke-3' />
        </button>
        <Button variant='ghost' size='icon' disabled className='hover:ring-ring-hover h-auto w-auto px-1 py-0.5 hover:ring-1'>
          <EllipsisIcon className='size-5 text-neutral-500 dark:text-neutral-400' />
        </Button>
      </div>

      <div className='mt-2 flex flex-col items-center gap-3 px-4'>
        <Skeleton className='mx-auto mt-4 mb-2 size-16 rounded-full' />
        <h2>
          <Skeleton className='h-3 w-44' />
        </h2>
        <div className='mt-1 flex flex-col gap-2'>
          <Skeleton className='h-2 w-48' />
          <Skeleton className='h-2 w-48' />
        </div>
      </div>

      <div className='mt-2 flex flex-wrap justify-evenly gap-8 px-6'>
        <StatisticElementSkeleton />
        <StatisticElementSkeleton />
        <StatisticElementSkeleton />
      </div>

      <Footer />
    </Card>
  )
}

function StatisticElementSkeleton() {
  return (
    <div className='flex max-w-fit flex-col items-center gap-3'>
      <Skeleton className='h-6 w-8' />
      <Skeleton className='h-2 w-16' />
    </div>
  )
}

function Footer() {
  return (
    <div className='-mt-6 -mb-1 flex flex-row-reverse justify-between border-t border-neutral-400/80 px-4 pt-3 text-xs text-neutral-500/70 dark:border-neutral-700 dark:text-neutral-400/70'>
      <div className='flex items-center gap-4'>
        <div>last modified: </div>
        <Skeleton className='h-2 w-20' />
      </div>
    </div>
  )
}
