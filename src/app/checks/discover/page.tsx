import Link from 'next/link'
import { getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'
import InfiniteKnowledgeCheckGrid from '@/src/components/checks/RenderInfiniteChecks'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function BrowseChecksPage() {
  const checks = await getPublicKnowledgeChecks()

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
      <InfiniteKnowledgeCheckGrid initialItems={checks} fetchNewItems={fetchItems} />
    </>
  )
}

async function fetchItems(offset: number) {
  'use server'

  return await getPublicKnowledgeChecks({ offset })
}
