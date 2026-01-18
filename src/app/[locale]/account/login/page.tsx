import { VenetianMaskIcon } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect, RedirectType } from 'next/navigation'
import KnowledgeCheckrIcon from '@/public/KnowledgeCheckr.png'
import { AnonymousSigninButton } from '@/src/components/account/login/AnonymousSigninButton'
import LoginForm from '@/src/components/account/login/LoginForm'
import SignupForm from '@/src/components/account/login/SignupForm'
import { DexProviderButton } from '@/src/components/Shared/Authentication/DexProviderButton'
import { GithubSocialButton } from '@/src/components/Shared/Authentication/GithubSocialButton'
import { GoogleSocialButton } from '@/src/components/Shared/Authentication/GoogleSocialButton'
import Card from '@/src/components/Shared/Card'
import { getServerSession } from '@/src/lib/auth/server'
import env from '@/src/lib/Shared/Env'
import { getRefererURL } from '@/src/lib/Shared/getRefererURL'
import { cn } from '@/src/lib/Shared/utils'

/**
 * This function is used to either return the callbackURL or undefined when no valid callbackURL is found.
 * @param refererHref The href of the referer that may or may not exist. When null --> no callbackURL will be returned (undefined)
 * @returns Returns either the refererURL when the currentURL is not not known or the refererURL is different than the currentURL. Otherwise it returns undefined.
 */
async function identifyCallbackHref(refererHref?: string | null) {
  const headersList = await headers()
  const currentHref = headersList.get('x-current-href')

  if (!refererHref || !URL.parse(refererHref, env.NEXT_PUBLIC_BASE_URL)) return undefined
  const refererUrl = URL.parse(refererHref, env.NEXT_PUBLIC_BASE_URL)!

  // external referer
  if (refererUrl.origin !== env.NEXT_PUBLIC_BASE_URL) return undefined

  if (!currentHref || !URL.parse(currentHref)) return refererUrl.pathname

  const isSameHref = currentHref === refererHref

  return isSameHref ? undefined : refererUrl.pathname
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ type: 'signup' | 'signin'; referer?: string }> }) {
  //? `referer` is passed along when the user switches between signin and signup
  let { type, referer } = await searchParams
  type = type || 'signin'

  const refererHref = referer ?? (await getRefererURL())

  // the origin of the request (referer) to which the user shall be redirected || or null when no referer is set or user comes from the same page.
  const refererCallback = await identifyCallbackHref(refererHref)

  // set callback either to origin-of-signin (referer)  or  redirect to fallback ('/account')
  const callbackURL = refererCallback ?? '/account'

  const { user } = await getServerSession()
  if (user) {
    return redirect('/account', RedirectType.replace)
  }

  return (
    <div className='flex h-full flex-1 items-center justify-center'>
      <Card
        className={cn(
          'flex max-w-md flex-1 flex-col gap-6 rounded-md p-6',
          'bg-gradient-to-b from-neutral-200/40 via-neutral-200/70 to-neutral-200/40 dark:from-neutral-800 dark:via-neutral-800/70 dark:to-neutral-800',
        )}
        disableInteractions>
        <div className='flex flex-col gap-6'>
          <FormHeader
            title={type === 'signup' ? 'Create an account' : 'Welcome back'}
            subTitle={type === 'signup' ? 'Increase your knowledge by creating KnowledgeChecks' : 'Jump right back to where you left of'}
          />
          {type === 'signup' ? <SignupForm callbackUrl={callbackURL} refererCallbackUrl={refererCallback} /> : <LoginForm callbackUrl={callbackURL} refererCallbackUrl={refererCallback} />}
        </div>

        <div className='flex flex-col gap-5'>
          <SocialProviderSection label={type} callbackUrl={callbackURL} />

          <div className='relative'>
            <div className='absolute inset-0 inset-x-12 flex items-center' aria-hidden='true'>
              <div className='h-[1px] w-full bg-gradient-to-r from-neutral-400/50 via-neutral-500 to-neutral-400/50 dark:from-neutral-700 dark:via-neutral-500 dark:to-neutral-700' />
            </div>

            <div className='relative flex justify-center'>
              <p className='flex gap-2 bg-[#EBECED] px-3 text-sm leading-6 tracking-widest text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'>
                <span className=''>or</span>
              </p>
            </div>
          </div>
          <AnonymousSigninButton icon={VenetianMaskIcon} className='mx-auto text-neutral-600 dark:text-neutral-200' callbackURL={callbackURL} />
        </div>
      </Card>
    </div>
  )
}

function FormHeader({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <div className='mb-2 flex flex-col items-center gap-2'>
      <Image src={KnowledgeCheckrIcon} alt='KnowledgeCheck-Icon' className='size-12' />
      <h1 className='text-xl font-semibold text-neutral-700 dark:text-neutral-200'>{title}</h1>
      <span className='-mt-1 text-sm text-gray-600/70 dark:text-gray-300/70'>{subTitle}</span>
    </div>
  )
}

function SocialProviderSection({ callbackUrl, label }: { callbackUrl?: string; label: string }) {
  if (!env.AUTH_GITHUB_ENABLED && !env.AUTH_GOOGLE_ENABLED && env.NEXT_PUBLIC_MODE !== 'test') return null

  return (
    <>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center' aria-hidden='true'>
          <div className='h-[1px] w-full bg-gradient-to-r from-neutral-400/50 via-neutral-500 to-neutral-400/50 dark:from-neutral-700 dark:via-neutral-500 dark:to-neutral-700' />
        </div>

        <div className='relative flex justify-center'>
          <p className='flex gap-2 bg-[#EBECED] px-3 text-sm leading-6 tracking-widest text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'>
            <span className='capitalize'>{label}</span>
            <span>via</span>
          </p>
        </div>
      </div>

      <div className='mx-auto flex w-full max-w-64 flex-wrap items-center justify-center gap-5 text-neutral-600/90 dark:text-neutral-200/90'>
        <GoogleSocialButton callbackURL={callbackUrl} />
        <GithubSocialButton callbackURL={callbackUrl} />
        <DexProviderButton callbackURL={callbackUrl} />
      </div>
    </>
  )
}
