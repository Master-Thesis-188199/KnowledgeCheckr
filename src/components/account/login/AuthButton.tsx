'use client'

import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { auth_client } from '@/src/lib/auth/client'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>
type BaseAuthButtonProps = ButtonProps & {
  callbackURL?: string
  errorCallbackURL?: string
}

export type AnonymousAuthButtonProps = BaseAuthButtonProps & {
  auth_type: 'anonymous'
  text: string
}

export type SocialAuthButtonProps = BaseAuthButtonProps & {
  auth_type: 'social'
  provider: 'github' | 'apple' | 'discord' | 'facebook' | 'google' | 'microsoft' | 'spotify' | 'twitch' | 'twitter' | 'dropbox' | 'linkedin' | 'gitlab' | 'tiktok' | 'reddit' | 'roblox' | 'vk' | 'kick'
}

export type OAuthButtonProps = BaseAuthButtonProps & {
  auth_type: 'oauth'
  provider: string
}

export type AuthButtonProps = AnonymousAuthButtonProps | SocialAuthButtonProps | OAuthButtonProps
export default function AuthButton({ callbackURL = process.env.NEXT_PUBLIC_BASE_URL, errorCallbackURL, ...props }: AuthButtonProps) {
  const [isLoading, setLoading] = useState(false)
  const { push, refresh } = useRouter()

  let signInAction: () => Promise<Any>

  if (props.auth_type === 'anonymous') {
    signInAction = () =>
      auth_client.signIn.anonymous({
        fetchOptions: {
          onSuccess: () => {
            if (callbackURL) push(callbackURL)
            else console.warn('[AuthButton]: No callbackUrl defined.')

            refresh()
          },

          onError: () => {
            if (errorCallbackURL) push(errorCallbackURL)
            else console.warn('[AuthButton]: No errorCallbackUrl defined.')

            refresh()
          },
        },
      })
  } else if (props.auth_type === 'social') {
    signInAction = () => auth_client.signIn.social({ provider: props.provider, callbackURL, errorCallbackURL })
  } else if (props.auth_type === 'oauth') {
    signInAction = () => auth_client.signIn.oauth2({ providerId: props.provider, callbackURL, errorCallbackURL })
  } else {
    signInAction = () => {
      console.error('[AuthButton]: Unknown auth_type', props)
      return Promise.reject(new Error('Unknown auth_type'))
    }
  }

  return (
    <button
      type='button'
      {...props}
      data-auth-provider={props.auth_type === 'anonymous' ? 'anonymous' : props.provider}
      className={cn(
        'flex items-center justify-evenly gap-4 rounded-sm px-3 py-2.5 tracking-wide ring-1 hover:cursor-pointer hover:shadow-sm',
        'bg-neutral-100/80 ring-neutral-400 dark:bg-neutral-800/50 dark:ring-neutral-600',
        'shadow-neutral-300 hover:bg-neutral-50/80 hover:ring-ring-hover dark:shadow-inherit dark:hover:bg-neutral-700/50 dark:hover:ring-ring-hover',
        props?.className,
      )}
      onClick={(e) => {
        setLoading(true)
        //* Loading state is not disabled as the authentication call finished immediately. This way the loading-indicator is removed by redirecting / refreshing the page
        signInAction()
        props.onClick?.call(null, e)
      }}
      children={
        <>
          {isLoading ? <LoaderCircle className='animate-spin' /> : props?.children}
          {props.auth_type === 'anonymous' && props.text}
        </>
      }
    />
  )
}
