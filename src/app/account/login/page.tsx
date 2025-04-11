import AppleIcon from '@/public/icons/social/AppleIcon'
import GithubSvg from '@/public/icons/social/GithubSvg'
import GoogleIcon from '@/public/icons/social/GoogleIcon'
import KnowledgeCheckrIcon from '@/public/KnowledgeCheckr.png'
import ProviderButton, { ProviderButtonProps } from '@/src/components/account/login/ProviderButton'
import { getServerSession } from '@/src/lib/auth/server'
import Image from 'next/image'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ type: 'signup' | 'signin' }> }) {
  let { type } = await searchParams
  type = type || 'signin'

  const { session, user } = await getServerSession()

  return (
    <div className='flex h-full flex-1 items-center justify-center'>
      <form className='flex max-w-md flex-1 flex-col gap-6 rounded-md bg-gradient-to-b from-neutral-200/40 via-neutral-200/70 to-neutral-200/40 p-6 ring-1 ring-neutral-300 dark:from-neutral-800 dark:via-neutral-800/70 dark:to-neutral-800 dark:ring-neutral-600/70'>
        <div className='flex flex-col gap-6'>
          {type === 'signup' ? <SignupFields /> : <LoginFields />}
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
          <SocialButton icon={GoogleIcon} provider='google' />
          <SocialButton icon={AppleIcon} provider='apple' />
          <SocialButton icon={GithubSvg} provider='github' />
        </div>
      </form>
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

function LoginFields() {
  return (
    <>
      <FormHeader title='Welcome back' subTitle='Jump right back to where you left of' />

      <label className='flex flex-col gap-2'>
        Email
        <input placeholder='your@email.com' className='rounded-md px-3 py-1.5 ring-1 ring-neutral-700 outline-0 focus:ring-[1.5px] focus:ring-neutral-600' type='email' />
      </label>
      <label className='flex flex-col gap-2'>
        Password
        <input placeholder='your password' type='password' className='rounded-md px-3 py-1.5 ring-1 ring-neutral-700 outline-0 focus:ring-[1.5px] focus:ring-neutral-600' />
      </label>

      <div className='mt-2 flex flex-col items-center justify-center gap-3'>
        <button className='mt-2 w-full max-w-xs self-center rounded-lg bg-neutral-300 px-4 py-2 ring-1 ring-neutral-400 outline-0 hover:cursor-pointer hover:bg-neutral-400/40 hover:ring-[1.8px] hover:ring-neutral-400/70 active:bg-neutral-700/90 active:ring-neutral-600 dark:bg-neutral-700/40 dark:ring-neutral-700 dark:hover:bg-neutral-700/70 dark:hover:ring-neutral-600/80'>
          Login
        </button>
        <p className='text-sm text-neutral-400 dark:text-neutral-400/70'>
          Don&apos;t have an Account?{' '}
          <Link href='/account/login?type=signup' className='px-2 text-neutral-600 hover:cursor-pointer hover:underline dark:text-neutral-200'>
            Signup
          </Link>
        </p>
      </div>
    </>
  )
}

function SignupFields() {
  return (
    <>
      <FormHeader title='Welcome' subTitle='Increase your knowledge by creating KnowledgeChecks' />

      <label className='flex flex-col gap-2'>
        Username
        <input placeholder='Alexander' className='rounded-md px-3 py-1.5 ring-1 ring-neutral-700 outline-0 focus:ring-[1.5px] focus:ring-neutral-600' type='text' />
      </label>
      <label className='flex flex-col gap-2'>
        Email
        <input placeholder='your@email.com' className='rounded-md px-3 py-1.5 ring-1 ring-neutral-700 outline-0 focus:ring-[1.5px] focus:ring-neutral-600' type='email' />
      </label>
      <label className='flex flex-col gap-2'>
        Password
        <input placeholder='your password' type='password' className='rounded-md px-3 py-1.5 ring-1 ring-neutral-700 outline-0 focus:ring-[1.5px] focus:ring-neutral-600' />
      </label>

      <div className='mt-2 flex flex-col items-center justify-center gap-3'>
        <button className='mt-2 w-full max-w-xs self-center rounded-lg bg-neutral-300 px-4 py-2 ring-1 ring-neutral-400 outline-0 hover:cursor-pointer hover:bg-neutral-400/40 hover:ring-[1.8px] hover:ring-neutral-400/70 active:bg-neutral-700/90 active:ring-neutral-600 dark:bg-neutral-700/40 dark:ring-neutral-700 dark:hover:bg-neutral-700/70 dark:hover:ring-neutral-600/80'>
          Login
        </button>
        <p className='text-sm text-neutral-400 dark:text-neutral-400/70'>
          Already have an Account?
          <Link href='/account/login?type=signin' className='px-2 text-neutral-600 hover:cursor-pointer hover:underline dark:text-neutral-200'>
            Signin
          </Link>
        </p>
      </div>
    </>
  )
}
