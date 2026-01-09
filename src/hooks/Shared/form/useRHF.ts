import { useActionState, useCallback, useMemo, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RHFBaseReturn, RHFServerAction, RHFServerState, RHFWithServerReturn, UseRHFFormProps, UseRHFOptions } from '@/src/hooks/Shared/form/react-hook-form/type'
import { buildBaseReturn, buildDefaultValues, createNoopServerAction, isServerAction } from '@/src/hooks/Shared/form/react-hook-form/utilts'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

const INITIAL_SERVER_STATE = { success: false } as const

/**
 * Internal hook that encapsulates all server-action/useActionState wiring.
 * Keeps `useRHF` body focused on "schema + RHF init + return shape".
 */
function useServerValidation<TSchema extends z.ZodSchema>(options?: UseRHFOptions<TSchema>) {
  const serverAction = options?.serverAction
  const hasServerValidation = isServerAction(serverAction)

  // Hooks must not be conditional; always provide an action function.
  const actionForUseActionState = (serverAction ?? createNoopServerAction<TSchema>()) as RHFServerAction<TSchema>

  const [serverState, dispatchServerAction] = useActionState<RHFServerState<TSchema>, z.infer<TSchema>>(actionForUseActionState, INITIAL_SERVER_STATE)

  const [, startTransition] = useTransition()

  const runServerValidation = useCallback(
    (values: z.infer<TSchema>) => {
      if (!hasServerValidation) return
      startTransition(() => {
        dispatchServerAction(values)
      })
    },
    [hasServerValidation, dispatchServerAction, startTransition],
  )

  return { hasServerValidation, serverState, runServerValidation }
}

// prettier-ignore
export default function useRHF<TSchema extends z.ZodSchema>( schema: TSchema, formProps?: UseRHFFormProps<TSchema>): RHFBaseReturn<TSchema>

// prettier-ignore
export default function useRHF<TSchema extends z.ZodSchema>( schema: TSchema, formProps: UseRHFFormProps<TSchema> | undefined, options: UseRHFOptions<TSchema>): RHFWithServerReturn<TSchema>

/**
 * Combines react-hook-form initialization with Zod schema validation + schema descriptions.
 * Optionally wires up a Next.js server action (useActionState) for server-side validation.
 */
export default function useRHF<TSchema extends z.ZodSchema>(schema: TSchema, formProps?: UseRHFFormProps<TSchema>, options?: UseRHFOptions<TSchema>) {
  const descriptions = useMemo(() => extractDescriptionMap(schema), [schema])
  const { hasServerValidation, serverState, runServerValidation } = useServerValidation<TSchema>(options)

  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(serverState, formProps),
    ...formProps,
  })

  const base = buildBaseReturn(form, descriptions)

  if (!hasServerValidation) return base

  return { ...base, runServerValidation, state: serverState }
}
