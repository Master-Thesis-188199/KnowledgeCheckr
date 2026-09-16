import { useActionState, useCallback, useMemo, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldValues, Resolver, useForm } from 'react-hook-form'
import { z } from 'zod'
import { RHFBaseReturn, RHFServerAction, RHFServerReturn, RHFServerState, RHFWithServerReturn, UseRHFFormProps, UseRHFOptions } from '@/src/hooks/Shared/form/react-hook-form/type'
import { buildBaseReturn, createNoopServerAction, isServerAction, useServerValidationResults } from '@/src/hooks/Shared/form/react-hook-form/utilts'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

/**
 * Internal hook that encapsulates all server-action/useActionState wiring.
 * Keeps `useRHF` body focused on "schema + RHF init + return shape".
 */
function useServerValidation<Type extends object>(options?: UseRHFOptions<Type>): RHFServerReturn<Type> & { hasServerValidation: boolean } {
  const serverAction = options?.serverAction
  const initialActionState = options?.initialActionState ?? ({} as RHFServerState<Type>)
  const hasServerValidation = isServerAction(serverAction)

  // Hooks must not be conditional; always provide an action function.
  const actionForUseActionState = (serverAction ?? createNoopServerAction<Type>()) as RHFServerAction<Type>

  const [serverState, dispatchServerAction] = useActionState<RHFServerState<Type>, Type>(actionForUseActionState, initialActionState)

  const [isServerValidationPending, startTransition] = useTransition()

  const runServerValidation = useCallback(
    (values: Type) => {
      if (!hasServerValidation) return
      startTransition(() => {
        dispatchServerAction(values)
      })
    },
    [hasServerValidation, dispatchServerAction, startTransition],
  )

  return { hasServerValidation, state: serverState, runServerValidation, isServerValidationPending }
}

// prettier-ignore
export default function useRHF<TSchema extends z.ZodType<X>, X extends object = object>( schema: TSchema, formProps?: UseRHFFormProps<z.output<TSchema>>): RHFBaseReturn<z.output<TSchema>>

// prettier-ignore
export default function useRHF<TSchema extends z.ZodType<X>, X extends object = object>( schema: TSchema, formProps: UseRHFFormProps<z.output<TSchema>> | undefined, options: UseRHFOptions<z.output<TSchema>>): RHFWithServerReturn<z.output<TSchema>>

/**
 * Combines react-hook-form initialization with Zod schema validation + schema descriptions.
 * Optionally wires up a Next.js server action (useActionState) for server-side validation.
 */
export default function useRHF<TSchema extends z.ZodType<X>, X extends object = object>(schema: TSchema, formProps?: UseRHFFormProps<z.output<TSchema>>, options?: UseRHFOptions<z.output<TSchema>>) {
  const descriptions = useMemo(() => extractDescriptionMap(schema), [schema])
  const { hasServerValidation, ...serverReturnProps } = useServerValidation<z.output<TSchema>>(options)
  const { instantiate } = schemaUtilities(schema)

  const form = useForm<z.output<TSchema>>({
    resolver: zodResolver(schema as z.ZodType<X, FieldValues>) as unknown as Resolver<z.output<TSchema>>,
    ...formProps,
    defaultValues:
      typeof formProps?.defaultValues === 'function' ? formProps.defaultValues(serverReturnProps.state.values, instantiate({ stripDefaultValues: true, generateRandomNumbers: false })) : undefined,
  })

  const base = buildBaseReturn(form, descriptions)

  useServerValidationResults(hasServerValidation, serverReturnProps.state, { setError: form.setError, clearErrors: form.clearErrors })

  if (!hasServerValidation) return base

  const serverReturn: RHFWithServerReturn<z.output<TSchema>> = {
    ...base,
    ...serverReturnProps,
    isValidationComplete:
      form.formState.isSubmitted && form.formState.isSubmitSuccessful && (!form.formState.isSubmitting || !serverReturnProps.isServerValidationPending) && !serverReturnProps.isServerValidationPending,
  }

  return serverReturn
}
