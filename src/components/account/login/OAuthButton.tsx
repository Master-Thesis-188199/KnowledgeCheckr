'use client'

import { useState } from 'react'
import { cn } from '@heroui/theme'
import { LoaderCircle } from 'lucide-react'
import { auth_client } from '@/src/lib/auth/client'

export interface OAuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  providerId: string
  callbackURL?: string
  errorCallbackURL?: string
}

export default function OAuthButton({ providerId, callbackURL = process.env.NEXT_PUBLIC_BASE_URL, errorCallbackURL, ...props }: OAuthButtonProps) {
  const [isLoading, setLoading] = useState(false)

  return (
    <button
      {...props}
      data-auth-provider={providerId}
      className={cn(
        'flex items-center justify-evenly gap-4 rounded-sm bg-neutral-300/60 px-3 py-2.5 tracking-wide ring-1 ring-neutral-400 hover:cursor-pointer dark:bg-neutral-800/50 dark:ring-neutral-600',
        props.className,
      )}
      onClick={() => {
        setLoading(true)
        auth_client.signIn.oauth2({ providerId, callbackURL, errorCallbackURL }).then(() => setLoading(false))
      }}
      children={isLoading ? <LoaderCircle className='animate-spin' /> : props.children}
    />
  )
}
