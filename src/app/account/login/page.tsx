import { FlaskConicalIcon, VenetianMaskIcon } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import GithubSvg from '@/public/icons/social/GithubSvg'
import GoogleIcon from '@/public/icons/social/GoogleIcon'
import KnowledgeCheckrIcon from '@/public/KnowledgeCheckr.png'
import { AnonymousSigninButton } from '@/src/components/account/login/AnonymousSigninButton'
import LoginForm from '@/src/components/account/login/LoginForm'
import OAuthButton from '@/src/components/account/login/OAuthButton'
import SignupForm from '@/src/components/account/login/SignupForm'
import { SocialButton } from '@/src/components/account/SocialButton'
import { getServerSession } from '@/src/lib/auth/server'
import env from '@/src/lib/Shared/Env'
import { getReferer } from '@/src/lib/Shared/getReferer'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ type: 'signup' | 'signin'; referer?: string }> }) {
  //? `referer` is passed along when the user switches between signin and signup
  let { type, referer } = await searchParams
  type = type || 'signin'

  const callbackUrl = referer ?? (await getReferer())

  const { user } = await getServerSession()
  if (user) {
    return redirect('/account')
  }

  return (
    <div className='flex h-full flex-1 items-center justify-center'>
      <div className='flex max-w-md flex-1 flex-col gap-6 rounded-md bg-gradient-to-b from-neutral-200/40 via-neutral-200/70 to-neutral-200/40 p-6 ring-1 ring-neutral-300 dark:from-neutral-800 dark:via-neutral-800/70 dark:to-neutral-800 dark:ring-neutral-600/70'>
        <div className='flex flex-col gap-6'>
          <FormHeader
            title={type === 'signup' ? 'Create an account' : 'Welcome back'}
            subTitle={type === 'signup' ? 'Increase your knowledge by creating KnowledgeChecks' : 'Jump right back to where you left of'}
          />
          {type === 'signup' ? <SignupForm callbackUrl={callbackUrl ?? '/'} /> : <LoginForm callbackUrl={callbackUrl ?? '/'} />}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center' aria-hidden='true'>
              <div className='h-[1px] w-full bg-gradient-to-r from-neutral-700 via-neutral-300 to-neutral-700 dark:via-neutral-500' />
            </div>

            <div className='relative flex justify-center'>
              <p className='flex gap-2 bg-neutral-200 px-3 text-sm leading-6 tracking-widest text-gray-900 dark:bg-neutral-800 dark:text-neutral-400'>
                <span className='capitalize'>{type}</span>
                <span>via</span>
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='mx-auto flex w-full max-w-64 flex-wrap items-center justify-center gap-5 text-neutral-200/90'>
            <SocialButton icon={GoogleIcon} callbackURL={callbackUrl ?? undefined} provider='google' aria-label='SignIn using Google' />
            <SocialButton icon={GithubSvg} callbackURL={callbackUrl ?? undefined} provider='github' aria-label='SignIn using GitHub' />
            {env.MODE === 'test' && <OAuthButton provider='dex' icon={FlaskConicalIcon} callbackURL='http://localhost:3000' />}
          </div>

          <div className='relative'>
            <div className='absolute inset-0 inset-x-12 flex items-center' aria-hidden='true'>
              <div className='h-[1px] w-full bg-gradient-to-r from-neutral-700 via-neutral-300 to-neutral-700 dark:via-neutral-500' />
            </div>

            <div className='relative flex justify-center'>
              <p className='flex gap-2 bg-neutral-200 px-3 text-sm leading-6 tracking-widest text-gray-900 dark:bg-neutral-800 dark:text-neutral-400'>
                <span className=''>or</span>
              </p>
            </div>
          </div>
          <AnonymousSigninButton icon={VenetianMaskIcon} className='mx-auto' callbackURL={callbackUrl ?? undefined} />
        </div>
      </div>
    </div>
  )
}

function FormHeader({ title, subTitle }: { title: string; subTitle?: string }) {
  return (
    <div className='mb-2 flex flex-col items-center gap-2'>
      <Image src={KnowledgeCheckrIcon} alt='KnowledgeCheck-Icon' className='size-12' />
      <h1 className='text-xl font-semibold'>{title}</h1>
      <span className='-mt-1 text-sm text-neutral-400 dark:text-gray-300/70'>{subTitle}</span>
    </div>
  )
}
