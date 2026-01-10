import { useEffect } from 'react'
import { DefaultValues, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { RHFBaseReturn, RHFServerAction, RHFServerState, UseRHFFormProps, UseRHFOptions } from '@/src/hooks/Shared/form/react-hook-form/type'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

export function isServerAction<TSchema extends z.ZodSchema>(action: UseRHFOptions<TSchema>['serverAction'] | undefined): action is RHFServerAction<TSchema> {
  return typeof action === 'function'
}

export function createNoopServerAction<TSchema extends z.ZodSchema>(): RHFServerAction<TSchema> {
  return async (prev) => prev
}

export function buildDefaultValues<TSchema extends z.ZodSchema>(serverState: RHFServerState<TSchema>, formProps?: UseRHFFormProps<TSchema>): DefaultValues<z.infer<TSchema>> {
  return {
    ...(serverState.values ?? ({} as DefaultValues<z.infer<TSchema>>)),
    ...(formProps?.defaultValues ?? {}),
  } as DefaultValues<z.infer<TSchema>>
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
  { setError, reset }: {} & Pick<UseFormReturn<z.infer<TSchema>>, 'reset' | 'setError'>,
) {
  useEffect(() => {
    if (!hasServerValidation) return

    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([_key, msgs]) => {
        const key = _key as keyof z.infer<TSchema>

        if (!msgs) return

        for (const msg of msgs) {
          if (msg.length === 0) continue

          // @ts-expect-error Expect key-of schema object not to satisfy `FieldPath` type
          setError(key, { type: 'server', message: msg })
        }
      })
    }

    if (state.rootError) {
      setError('root', { type: 'server', message: state.rootError })
    }
  }, [state.fieldErrors, state.rootError, setError, hasServerValidation])

  useEffect(() => {
    if (!hasServerValidation) return

    if (state.success) reset()
  }, [state.success, reset, hasServerValidation])
}
