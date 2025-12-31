import GithubSvg from '@/public/icons/social/GithubSvg'
import { SocialAuthButtonProps } from '@/src/components/account/login/AuthButton'
import { SocialButton } from '@/src/components/account/SocialButton'
import env from '@/src/lib/Shared/Env'

export function GithubSocialButton(props: {} & Omit<SocialAuthButtonProps, 'auth_type' | 'provider' | 'aria-label' | 'icon'>) {
  if (!env.AUTH_GITHUB_ENABLED) return null

  return <SocialButton icon={GithubSvg} provider='github' aria-label='SignIn using GitHub' {...props} />
}
