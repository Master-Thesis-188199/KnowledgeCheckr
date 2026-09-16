'use client'

import CredentialProviderForm from '@/src/components/account/login/CredentialProviderForm'
import Field from '@/src/components/Shared/form/Field'
import { useI18n } from '@/src/i18n/client-localization'
import { getLoginSchema } from '@/src/schemas/AuthenticationSchema'
import { loginAction } from '../../../lib/account/login/AccountActions'

export default function LoginForm({ callbackUrl, refererCallbackUrl }: { callbackUrl?: string; refererCallbackUrl?: string }) {
  const t = useI18n()
  return (
    <CredentialProviderForm
      schema={getLoginSchema(t)}
      currentMode='login'
      formAction={loginAction}
      formProps={{
        defaultValues: (stateValues, instantiations) => ({
          ...instantiations,
          callbackURL: callbackUrl,
          ...stateValues,
        }),
      }}
      refererCallbackUrl={refererCallbackUrl}
      renderFields={({ form }) => (
        <>
          <Field form={form} name='callbackURL' className='hidden' containerClassname='hidden' readOnly showLabel={false} />
          <Field form={form} name='email' placeholder='user@email.com' type='email' />
          <Field form={form} name='password' placeholder='your password' type='password' />
        </>
      )}
    />
  )
}
