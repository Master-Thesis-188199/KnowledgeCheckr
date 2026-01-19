import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { RHFBaseReturn, RHFServerAction, RHFServerState, UseRHFOptions } from '@/src/hooks/Shared/form/react-hook-form/type'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

export function isServerAction<TSchema extends z.ZodSchema>(action: UseRHFOptions<TSchema>['serverAction'] | undefined): action is RHFServerAction<TSchema> {
  return typeof action === 'function'
}

export function createNoopServerAction<TSchema extends z.ZodSchema>(): RHFServerAction<TSchema> {
  return async (prev) => prev
}

export function buildBaseReturn<TSchema extends z.ZodSchema>(form: UseFormReturn<z.infer<TSchema>>, descriptions: ReturnType<typeof extractDescriptionMap>): RHFBaseReturn<TSchema> {
  return {
    form,
    descriptions,
    baseFieldProps: { form, descriptions },
  }
}

/**
 * This function listens to the server-validation-state and adds `fieldErrors` to the form when the validation fails. When the server-validation is successful it will reset the form.
 * @param hasServerValidation Setting this value to false will effectively disable the functionality of this hook as it will exit each useEffect immediately.
 * @param state The server-validation-state used to extract server-side-errors from to add them to the react-hook-form instance
 * @param form.setErrror The `setError` function from the react-hook-form instance
 * @param form.reset The `reset` function from the react-hook-form instance
 */
export function useServerValidationResults<TSchema extends z.ZodSchema>(
  hasServerValidation: boolean,
  state: RHFServerState<TSchema>,
  { setError, clearErrors }: {} & Pick<UseFormReturn<z.infer<TSchema>>, 'setError' | 'clearErrors'>,
) {
  useEffect(() => {
    if (!hasServerValidation) return

    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([_key, msgs]) => {
        const key = _key as keyof z.infer<TSchema>

        if (!msgs) return

        // @ts-expect-error Expect key-of schema object not to satisfy `FieldPath` type
        setError(key, { type: 'server', message: msgs.join(' & ') })
      })
    }

    if (state.rootError) {
      setError('root', { type: 'server', message: state.rootError })
    }
  }, [state.fieldErrors, state.rootError, setError, hasServerValidation])

  useEffect(() => {
    if (!hasServerValidation) return

    if (state.success) clearErrors()
  }, [state.success, clearErrors, hasServerValidation])
}
