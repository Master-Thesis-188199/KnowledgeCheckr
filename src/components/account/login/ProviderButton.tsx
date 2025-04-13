'use client'

import { auth_client } from '@/src/lib/auth/client'

type ProviderOptions =
  | 'github'
  | 'apple'
  | 'discord'
  | 'facebook'
  | 'google'
  | 'microsoft'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'dropbox'
  | 'linkedin'
  | 'gitlab'
  | 'tiktok'
  | 'reddit'
  | 'roblox'
  | 'vk'
  | 'kick'

export interface ProviderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: ProviderOptions
  callbackURL?: string
  errorCallbackURL?: string
}

export default function ProviderButton({ provider, callbackURL, errorCallbackURL, ...props }: ProviderButtonProps) {
  return (
    <button
      {...props}
      onClick={() => {
        auth_client.signIn.social({ provider, callbackURL, errorCallbackURL })
      }}
    />
  )
}
