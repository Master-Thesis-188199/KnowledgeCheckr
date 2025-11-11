import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import getDatabase from '@/database/Database'
import { db_user } from '@/database/drizzle/schema'
import GithubSvg from '@/public/icons/social/GithubSvg'
import GoogleIcon from '@/public/icons/social/GoogleIcon'
import { SocialButton } from '@/src/components/account/SocialButton'
import { UserAvatar } from '@/src/components/root/Navigation/elements/SidebarUserBanner'
import Line from '@/src/components/Shared/Line'
import PageHeading from '@/src/components/Shared/PageHeading'
import { auth, BetterAuthUser, getServerSession } from '@/src/lib/auth/server'
import { cn } from '@/src/lib/Shared/utils'

export default async function AccountPage() {
  const { session, user } = await getServerSession()

  if (!session || !user) {
    redirect('/account/login')
  }

  const { isAnonymous } = user

  return (
    <>
      <PageHeading title='Account Information' />

      <div className='mx-auto flex h-full max-w-lg items-center justify-center pb-12'>
        <form className='flex min-w-sm flex-col gap-8 rounded-md bg-neutral-200/40 p-6 ring-1 ring-neutral-400/80 dark:bg-transparent dark:ring-neutral-600'>
          <div className='flex flex-col items-center gap-5'>
            <UserAvatar user={user} className='m-0 size-16 self-center' />
            <div className='flex flex-col items-center gap-2'>
              <span className='font-semibold capitalize'>{user.name}</span>
              <span className='text-sm tracking-wide text-neutral-500 dark:text-neutral-400'>{user.email}</span>
            </div>
          </div>

          <LinkAccountSection user={user} />

          <button
            type='submit'
            formAction={signout}
            className={cn(
              'mt-2 rounded-md px-3 py-1.5 ring-1 hover:cursor-pointer hover:ring-[1.5px]',
              'bg-neutral-300/60 ring-neutral-400 hover:ring-neutral-500/80',
              'dark:bg-neutral-700 dark:ring-neutral-600 dark:hover:ring-neutral-500/70',
            )}>
            Signout
            {isAnonymous && <span className='ml-2 text-sm text-neutral-400'>(delete data)</span>}
          </button>
        </form>
      </div>
    </>
  )
}

function LinkAccountSection({ user: { isAnonymous } }: { user: BetterAuthUser }) {
  return (
    <div className='mx-2 flex flex-col gap-6'>
      <Line className='text-neutral-500' dashSize={4} dashed dashSpacing={6} />
      <div className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold dark:text-neutral-300'>Link you Account</h2>
        <span className='text-sm text-balance dark:text-neutral-400'>
          In order to keep your data after signing out or closing this tab, you can sign-in through a social-provider like Google to keep your data.{' '}
        </span>
      </div>
      <div className={cn('mx-auto hidden w-full max-w-64 flex-wrap items-center justify-center gap-5 text-neutral-200/90', isAnonymous && 'flex')}>
        <SocialButton icon={GoogleIcon} provider='google' aria-label='SignIn using Google' />
        <SocialButton icon={GithubSvg} provider='github' aria-label='SignIn using GitHub' />
      </div>
    </div>
  )
}

async function signout() {
  'use server'
  //? Note that this would alloy users to delete their examination-results --> sign users automatically out after they submitted their examination-results

  const { user } = await getServerSession()
  const db = await getDatabase()

  await auth.api.signOut({ headers: await headers() })

  if (user?.isAnonymous) {
    console.log(`[BetterAuth]: Anonymous user (${user.email}) signed out, account about to be deleted...`)
    await db.delete(db_user).where(eq(db_user.id, user.id))
  }

  redirect('/account/login')
}
