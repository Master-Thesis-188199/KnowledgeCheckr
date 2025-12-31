import { FlaskConicalIcon } from 'lucide-react'
import { OAuthButtonProps } from '@/src/components/account/login/AuthButton'
import OAuthButton from '@/src/components/account/login/OAuthButton'
import env from '@/src/lib/Shared/Env'

export function DexProviderButton(props: {} & Omit<OAuthButtonProps, 'auth_type' | 'provider' | 'aria-label' | 'icon'>) {
  if (env.NEXT_PUBLIC_MODE !== 'test') return null

  return <OAuthButton provider='dex' icon={FlaskConicalIcon} {...props} />
}
