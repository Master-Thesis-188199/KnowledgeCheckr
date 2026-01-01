import GoogleIcon from '@/public/icons/social/GoogleIcon'
import { SocialAuthButtonProps } from '@/src/components/account/login/AuthButton'
import { SocialButton } from '@/src/components/account/SocialButton'
import env from '@/src/lib/Shared/Env'

export function GoogleSocialButton(props: {} & Omit<SocialAuthButtonProps, 'auth_type' | 'provider' | 'aria-label' | 'icon'>) {
  if (!env.AUTH_GOOGLE_ENABLED) return null

  return <SocialButton icon={GoogleIcon} provider='google' aria-label='SignIn using Google' {...props} />
}
