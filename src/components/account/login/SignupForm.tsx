/* app/account/login/SignupForm.tsx */
'use client'

import CredentialProviderForm from '@/src/components/account/login/CredentialProviderForm'
import Field from '@/src/components/Shared/form/Field'
import { SignupSchema } from '@/src/schemas/AuthenticationSchema'
import { signupAction } from '../../../lib/account/login/AccountActions'

export default function SignupForm({ callbackUrl, refererCallbackUrl }: { callbackUrl?: string; refererCallbackUrl?: string }) {
  return (
    <CredentialProviderForm
      schema={SignupSchema}
      currentMode='signUp'
      formAction={signupAction}
      refererCallbackUrl={refererCallbackUrl}
      formProps={{
        defaultValues: (stateValues, instantiations) => ({
          ...instantiations,
          callbackURL: callbackUrl,
          ...stateValues,
        }),
      }}
      renderFields={({ form }) => (
        <>
          <Field form={form} name='callbackURL' className='hidden' containerClassname='hidden' readOnly showLabel={false} />

          <Field form={form} label='Username' name='name' placeholder='your username' type='text' />
          <Field form={form} name='email' placeholder='user@email.com' type='email' />
          <Field form={form} name='password' placeholder='your password' type='password' />
        </>
      )}
    />
  )
}
