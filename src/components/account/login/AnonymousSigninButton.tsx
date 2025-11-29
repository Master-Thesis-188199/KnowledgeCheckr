import AuthButton, { AnonymousAuthButtonProps } from '@/src/components/account/login/AuthButton'
import { cn } from '@/src/lib/Shared/utils'

type Props = Omit<AnonymousAuthButtonProps, 'auth_type' | 'text'> & {
  iconClassName?: string
  icon: React.ComponentType<{ className?: string }>
}

export function AnonymousSigninButton({ callbackURL, errorCallbackURL, icon: Icon, iconClassName, ...props }: Props) {
  return (
    <AuthButton auth_type='anonymous' {...props} callbackURL={callbackURL} errorCallbackURL={errorCallbackURL} text='Continue Anonymously'>
      <Icon className={cn('size-6', iconClassName)} />
    </AuthButton>
  )
}
