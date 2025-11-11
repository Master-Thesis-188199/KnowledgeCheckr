'use client'

import { GlassesIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { ProviderButtonProps } from '@/src/components/account/login/ProviderButton'
import { auth_client } from '@/src/lib/auth/client'
import { cn } from '@/src/lib/Shared/utils'

export function AnonymousSigninButton({ className, ...props }: ProviderButtonProps) {
  const { push, refresh } = useRouter()

  return (
    <button
      type='button'
      onClick={() => {
        auth_client.signIn
          .anonymous()
          .then(() => {
            if (!props.callbackURL || !process.env.NEXT_PUBLIC_BASE_URL) return refresh()

            push(props.callbackURL ?? process.env.NEXT_PUBLIC_BASE_URL)
          })
          .catch(() => {
            if (!props.errorCallbackURL || !process.env.NEXT_PUBLIC_BASE_URL) return refresh()

            push(props.errorCallbackURL ?? process.env.NEXT_PUBLIC_BASE_URL)
          })
      }}
      className={cn(
        'flex items-center justify-evenly gap-4 rounded-sm bg-neutral-300/60 px-3 py-2.5 tracking-wide ring-1 ring-neutral-400 hover:cursor-pointer dark:bg-neutral-800/50 dark:ring-neutral-600',
        className,
      )}>
      <GlassesIcon className={twMerge('size-6')} />
      Continue Anonymously
    </button>
  )
}
