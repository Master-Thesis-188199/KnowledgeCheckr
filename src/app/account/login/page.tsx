import GithubSvg from '@/public/icons/social/GithubSvg'
import GoogleIcon from '@/public/icons/social/GoogleIcon'
import KnowledgeCheckrIcon from '@/public/KnowledgeCheckr.png'
import LoginForm from '@/src/app/account/login/LoginForm'
import SignupForm from '@/src/app/account/login/SignupForm'
import ProviderButton, { ProviderButtonProps } from '@/src/components/account/login/ProviderButton'
import { getServerSession } from '@/src/lib/auth/server'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ type: 'signup' | 'signin' }> }) {
  let { type } = await searchParams
  type = type || 'signin'

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
          {type === 'signup' ? <SignupForm /> : <LoginForm />}
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

        <div className='mx-auto flex w-full max-w-64 items-center justify-center gap-5 text-neutral-200/90'>
          <SocialButton icon={GoogleIcon} provider='google' aria-label='SignIn using Google' />
          <SocialButton icon={GithubSvg} provider='github' aria-label='SignIn using GitHub' />
        </div>
      </div>
    </div>
  )
}

function SocialButton({ icon: Icon, iconClassName, ...props }: { icon: React.ComponentType<{ className?: string }>; iconClassName?: string } & ProviderButtonProps) {
  return (
    <ProviderButton
      type='button'
      className='flex items-center justify-evenly gap-4 rounded-sm bg-neutral-300/60 px-3 py-2.5 tracking-wide ring-1 ring-neutral-400 hover:cursor-pointer dark:bg-neutral-800/50 dark:ring-neutral-600'
      {...props}>
      <Icon className={twMerge('size-6', iconClassName)} />
    </ProviderButton>
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
