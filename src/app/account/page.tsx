import { UserAvatar } from '@/src/components/root/Navigation/elements/SidebarUserBanner'
import PageHeading from '@/src/components/Shared/PageHeading'
import { auth, getServerSession } from '@/src/lib/auth/server'
import { cn } from '@/src/lib/Shared/utils'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const { session, user } = await getServerSession()

  if (!session || !user) {
    redirect('/account/login')
  }

  const {} = session

  return (
    <>
      <PageHeading title='Account Information' />

      <div className='flex h-full items-center justify-center pb-12'>
        <form className='flex min-w-sm flex-col gap-8 rounded-md bg-neutral-200/40 p-6 ring-1 ring-neutral-400/80 dark:bg-transparent dark:ring-neutral-600'>
          <UserAvatar user={user} className='size-16 self-center' />

          <div className='flex flex-col items-center gap-1'>
            <span className='font-semibold capitalize'>{user.name}</span>
            <span className='text-sm tracking-wide text-neutral-500 dark:text-neutral-400'>{user.email}</span>
          </div>

          <button
            type='submit'
            formAction={signout}
            className={cn(
              'mt-2 rounded-md px-3 py-1.5 ring-1 hover:cursor-pointer hover:ring-[1.5px]',
              'bg-neutral-300/60 ring-neutral-400 hover:ring-neutral-500/80',
              'dark:bg-neutral-700 dark:ring-neutral-600 dark:hover:ring-neutral-500/70',
            )}>
            Signout
          </button>
        </form>
      </div>
    </>
  )
}

async function signout() {
  'use server'

  await auth.api.signOut({ headers: await headers() })
  redirect('/account/login')
}
