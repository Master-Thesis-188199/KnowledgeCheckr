import Link from 'next/link'
import PageHeading from '@/src/components/Shared/PageHeading'

export default function Home() {
  return (
    <div className=''>
      <PageHeading title='KnowledgeCheckr' showBreadcrumbs={false} />
      <div className='flex flex-col gap-3 tracking-wide'>
        <p className='text-neutral-700 dark:text-neutral-300'>Create your own KnowledgeChecks to boost your knowledge to the next level.</p>
        <p className='text-neutral-700 dark:text-neutral-300'>
          Get started by first{' '}
          <Link href={'/account/login?type=signup'} className='mx-1 rounded-md bg-neutral-200 px-2 py-1 underline underline-offset-2 dark:bg-neutral-700'>
            creating an account
          </Link>
          and then{' '}
          <Link href={'/checks/create'} className='mx-1 rounded-md bg-neutral-200 px-2 py-1 underline underline-offset-2 dark:bg-neutral-700'>
            creating a personal KnowledgeCheck
          </Link>{' '}
        </p>
      </div>
    </div>
  )
}
