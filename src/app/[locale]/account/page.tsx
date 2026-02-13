import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { UserAvatar } from '@/src/components/root/Navigation/elements/SidebarUserBanner'
import { DexProviderButton } from '@/src/components/Shared/Authentication/DexProviderButton'
import { GithubSocialButton } from '@/src/components/Shared/Authentication/GithubSocialButton'
import { GoogleSocialButton } from '@/src/components/Shared/Authentication/GoogleSocialButton'
import Card from '@/src/components/Shared/Card'
import Line from '@/src/components/Shared/Line'
import PageHeading from '@/src/components/Shared/PageHeading'
import { deleteUser } from '@/src/lib/auth/deleteUser'
import { auth, BetterAuthUser, getServerSession } from '@/src/lib/auth/server'
import env from '@/src/lib/Shared/Env'
import { cn } from '@/src/lib/Shared/utils'

export default async function AccountPage() {
  const { session, user } = await getServerSession()

  if (!session || !user) {
    redirect('/account/login', RedirectType.replace)
  }

  const { isAnonymous } = user
  const linkingPossible = env.AUTH_GITHUB_ENABLED || env.AUTH_GOOGLE_ENABLED || env.NEXT_PUBLIC_MODE === 'test'

  return (
    <>
      <PageHeading title='Account Information' />

      <div className='mx-auto flex h-full max-w-lg items-center justify-center pb-12'>
        <Card as='form' disableInteractions className='flex min-w-sm flex-col gap-8 rounded-md p-6'>
          <div className='flex flex-col items-center gap-5'>
            <UserAvatar user={user} className='m-0 size-16 self-center' />
            <div className='flex flex-col items-center gap-2'>
              <span className='font-semibold capitalize'>{user.name}</span>
              <span className={cn('text-sm tracking-wide text-neutral-500 dark:text-neutral-400', isAnonymous && 'hidden')}>{user.email}</span>
            </div>
          </div>

          <LinkAccountSection user={user} disabled={!linkingPossible} />

          <button
            type='submit'
            formAction={signout}
            className={cn(
              'rounded-md px-3 py-1.5 ring-1 hover:cursor-pointer hover:ring-[1.5px]',
              'bg-neutral-300/60 text-neutral-700 ring-neutral-400 dark:bg-neutral-700 dark:text-neutral-200 dark:ring-neutral-600',
              'hover:ring-ring-hover dark:hover:ring-ring-hover',
            )}>
            Signout
            {isAnonymous && <span className='ml-2 text-sm text-neutral-500 dark:text-neutral-400'>(delete data)</span>}
          </button>
        </Card>
      </div>
    </>
  )
}

function LinkAccountSection({ user: { isAnonymous }, disabled }: { user: BetterAuthUser; disabled?: boolean }) {
  if (!isAnonymous || disabled) return null

  return (
    <div className='mx-2 flex flex-col gap-6'>
      <Line className='text-neutral-400 dark:text-neutral-500' dashSize={4} dashed dashSpacing={6} />
      <div className='flex flex-col gap-2'>
        <h2 className='text-lg font-semibold text-neutral-600 dark:text-neutral-300'>Link your Account</h2>
        <span className='text-sm text-neutral-500 dark:text-neutral-400'>
          To keep your data after signing out or closing this tab, you can sign in through a social provider like Google or GitHub.
        </span>
      </div>
      <div className='mx-auto flex w-full max-w-64 flex-wrap items-center justify-center gap-5 text-neutral-700/90 dark:text-neutral-200/90'>
        <GoogleSocialButton callbackURL={`${env.NEXT_PUBLIC_BASE_URL}/account`} />
        <GithubSocialButton callbackURL={`${env.NEXT_PUBLIC_BASE_URL}/account`} />
        <DexProviderButton callbackURL={`${env.NEXT_PUBLIC_BASE_URL}/account`} />
      </div>
    </div>
  )
}

async function signout() {
  'use server'

  const { user } = await getServerSession()

  await auth.api.signOut({ headers: await headers() })

  if (user?.isAnonymous) {
    await deleteUser({ userId: user.id, abortOnExaminationResults: true })
  }

  redirect('/account/login', RedirectType.replace)
}
