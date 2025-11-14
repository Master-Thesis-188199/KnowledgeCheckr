import AuthButton, { SocialAuthButtonProps } from '@/src/components/account/login/AuthButton'
import { cn } from '@/src/lib/Shared/utils'

type Props = Omit<SocialAuthButtonProps, 'auth_type'> & {
  iconClassName?: string
  icon: React.ComponentType<{ className?: string }>
}

/**
 * Renders a simple authentication button that will sign the user through a social provider i.e. Google or GitHub
 */
export function SocialButton({ icon: Icon, iconClassName, provider, callbackURL, errorCallbackURL, ...props }: Props) {
  return (
    <AuthButton auth_type='social' {...props} callbackURL={callbackURL} errorCallbackURL={errorCallbackURL} provider={provider}>
      <Icon className={cn('size-6', iconClassName)} />
    </AuthButton>
  )
}
