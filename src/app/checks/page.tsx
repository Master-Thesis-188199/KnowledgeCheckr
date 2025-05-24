import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import { InitialsIcon } from '@/src/components/Shared/InitialsIcon'
import { getServerSession } from '@/src/lib/auth/server'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { lorem } from 'next/dist/client/components/react-dev-overlay/ui/utils/lorem'
import Link from 'next/link'
import { unauthorized } from 'next/navigation'
import { Fragment } from 'react'

export default async function ChecksPage() {
  const { user } = await getServerSession()

  if (!user) {
    unauthorized()
  }
  const checks = await getKnowledgeChecksByOwner(user.id, { limit: 10 })

  return (
    <main>
      <h1 className='mb-8 text-[22px] font-semibold tracking-wider'>Your Checks</h1>
      {checks.length === 0 && (
        <div>
          No checks found. Create a new one{' '}
          <Link href='/checks/create' className='text-blue-500 underline'>
            here
          </Link>
          .
        </div>
      )}
      <div className='checks grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-8'>
        {checks.map((check, i) => (
          <RenderCheck key={i} {...check} />
        ))}
      </div>
    </main>
  )
}

function RenderCheckGrid(check: KnowledgeCheck) {
  return (
    <div className='relative flex flex-col gap-2 rounded-md bg-neutral-200/60 p-4 ring-1 ring-neutral-400/60 hover:cursor-pointer hover:bg-neutral-300/50 hover:ring-2 hover:ring-neutral-400/80 dark:bg-neutral-700/40 dark:ring-neutral-600 dark:hover:bg-neutral-700 dark:hover:ring-neutral-500'>
      <div className='absolute top-0 right-0 rounded-bl-2xl bg-neutral-400/30 pt-1 pr-1 pb-1.5 pl-2 text-sm tracking-wide dark:bg-blue-600/40'>#{check.id}</div>
      <div className='check-header flex items-center justify-between gap-2 border-b border-b-neutral-400/60 pb-2 dark:border-b-neutral-500'>
        <span>{check.name}</span>
      </div>
      <div className='grid grid-cols-[auto_1fr] gap-x-6 gap-y-4'>
        {Object.entries(check)
          .filter(([key, value]) => !!value && typeof value !== 'object')
          .filter(([key]) => !['id', 'name'].includes(key))
          .map(([key, value], i) => (
            <Fragment key={i}>
              <span className='text-neutral-700 capitalize dark:text-neutral-300'>{key}:</span>
              <span className='text-neutral-500 dark:text-neutral-400'>{String(value)}</span>
            </Fragment>
          ))}
      </div>
    </div>
  )
}

function RenderCheck(check: KnowledgeCheck) {
  return (
    <Link
      href={`/checks/${check.id}`}
      className='flex flex-col justify-between gap-10 rounded-md py-4 ring-1 hover:ring-[1.5px] dark:bg-neutral-700/30 dark:ring-neutral-500/70 hover:dark:bg-neutral-700/60 hover:dark:ring-neutral-500 focus:dark:bg-neutral-700/60'>
      <div className='flex flex-col items-center gap-1 px-4'>
        <InitialsIcon size={64} name={check.name || 'XX'} className='mx-auto mt-4 mb-2 size-auto' />
        <h2 className='text-center text-xl font-semibold dark:text-neutral-300'>{check.name || lorem.substring(0, Math.random() * 10 + 10)}</h2>
        <span className='line-clamp-2 text-center text-sm text-balance dark:text-neutral-400'>{check.description || lorem.substring(0, Math.random() * 100 + 20)}</span>
      </div>
      <div className='flex flex-wrap justify-evenly gap-8 px-6 text-neutral-300'>
        <div className='flex max-w-fit flex-col items-center gap-1'>
          <dt className='text-sm text-neutral-400'>Questions</dt>
          <dd className='order-first text-lg font-semibold tracking-tight text-neutral-300'>{check.questions.length}</dd>
        </div>
        <div className='flex max-w-fit flex-col items-center gap-1'>
          <dt className='text-sm text-neutral-400'>estimated Time</dt>
          <dd className='order-first text-lg font-semibold tracking-tight text-neutral-300'>
            10<span className='text-base'>m</span>
          </dd>
        </div>
        <div className='flex max-w-fit flex-col items-center gap-1'>
          <dt className='text-sm text-neutral-400'>Points</dt>
          <dd className='order-first text-lg font-semibold tracking-tight text-neutral-300'>{check.questions.map((q) => q.points).reduce((prev, current, index, array) => (prev += current), 0)}</dd>
        </div>
      </div>
    </Link>
  )
}
