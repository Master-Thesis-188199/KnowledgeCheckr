import { cn } from '@heroui/theme'
import { env } from 'process'
import { twMerge } from 'tailwind-merge'
import ProviderButton, { ProviderButtonProps } from '@/src/components/account/login/ProviderButton'

/**
 * Renders a simple `ProviderButton` that allows the user to sign in with a given social-provider, e.g. Google, GitHub.
 */
export function SocialButton({ icon: Icon, iconClassName, className, ...props }: { icon: React.ComponentType<{ className?: string }>; iconClassName?: string } & ProviderButtonProps) {
  return (
    <ProviderButton
      type='button'
      data-auth-provider={props.provider}
      className={cn(
        'flex items-center justify-evenly gap-4 rounded-sm bg-neutral-300/60 px-3 py-2.5 tracking-wide ring-1 ring-neutral-400 hover:cursor-pointer dark:bg-neutral-800/50 dark:ring-neutral-600',
        className,
      )}
      callbackURL={props.callbackURL ?? env.NEXT_PUBLIC_BASE_URL}
      errorCallbackURL={env.NEXT_PUBLIC_BASE_URL}
      {...props}>
      <Icon className={twMerge('size-6', iconClassName)} />
    </ProviderButton>
  )
}
