import { cn } from '@heroui/theme'
import AuthButton, { OAuthButtonProps } from '@/src/components/account/login/AuthButton'

type Props = Omit<OAuthButtonProps, 'auth_type'> & {
  iconClassName?: string
  icon: React.ComponentType<{ className?: string }>
}

export default function OAuthButton({ provider, callbackURL = process.env.NEXT_PUBLIC_BASE_URL, errorCallbackURL, icon: Icon, iconClassName, ...props }: Props) {
  return (
    <AuthButton {...props} auth_type='oauth' callbackURL={callbackURL} errorCallbackURL={errorCallbackURL} provider={provider}>
      <Icon className={cn('size-6', iconClassName)} />
    </AuthButton>
  )
}
