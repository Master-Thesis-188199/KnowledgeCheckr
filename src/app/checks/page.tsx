import Link from 'next/link'
import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

export default async function ChecksPage() {
  const { user } = await requireAuthentication()
  const checks = await getKnowledgeChecksByOwner(user.id)

  return (
    <>
      <PageHeading title='Your Checks' />
      {checks.length === 0 && (
        <div>
          No checks found. Create a new one{' '}
          <Link href='/checks/create' className='text-blue-500 underline dark:text-blue-500'>
            here
          </Link>
          .
        </div>
      )}

      {/* <InfiniteKnowledgeCheckGrid initialItems={checks} fetchItems={getKnowledgeChecksByOwner} fetchProps={['', {}]} /> */}
    </>
  )
}

async function fetchItems(offset: number) {
  'use server'
  const { user } = await requireAuthentication()

  return await getKnowledgeChecksByOwner(user.id, { offset })
}
