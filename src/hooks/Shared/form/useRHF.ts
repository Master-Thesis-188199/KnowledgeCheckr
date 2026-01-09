'use client'

import { useActionState, useCallback, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DefaultValues, useForm, UseFormProps } from 'react-hook-form'
import { z } from 'zod'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

type ServerActionState<TSchema extends z.ZodSchema> = {
  success: boolean
  fieldErrors?: { [key in keyof z.infer<TSchema>]?: string[] }
  rootError?: string
  values?: Partial<z.infer<TSchema>>
}
type ServerValidationAction<TSchema extends z.ZodSchema> = (state: ServerActionState<TSchema>, data: z.infer<TSchema>) => Promise<ServerActionState<TSchema>>

type UseRHFOptions<TSchema extends z.ZodSchema> = {
  serverAction?: ServerValidationAction<TSchema>
}
type UseRHFBaseReturn<TSchema extends z.ZodSchema> = {
  form: ReturnType<typeof useForm<z.infer<TSchema>>>
  descriptions: ReturnType<typeof extractDescriptionMap>
  baseFieldProps: {
    form: ReturnType<typeof useForm<z.infer<TSchema>>>
    descriptions: ReturnType<typeof extractDescriptionMap>
  }
}

type UseRHFWithServerReturn<TSchema extends z.ZodSchema> = UseRHFBaseReturn<TSchema> & {
  callServerAction: (values: z.infer<TSchema>) => void
  state: ServerActionState<TSchema>
}

// prettier-ignore
export default function useRHF<TSchema extends z.ZodSchema>(schema: TSchema, formProps?: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>): UseRHFBaseReturn<TSchema>
// prettier-ignore
export default function useRHF<TSchema extends z.ZodSchema>( schema: TSchema, formProps: Omit<UseFormProps<z.infer<TSchema>>, 'resolver'> | undefined, options: UseRHFOptions<TSchema>): UseRHFWithServerReturn<TSchema>

/**
 * This hook is used to combine the initialization of a react-hook-form and the retrieval of the schema descriptions into one.
 * @param schema The schema used to validate the form and to retrieve its respective fields descriptions.
 * @param formProps The properties used to configure the react-hook-form form.
 * @returns The created react-hook-form form instance, the retrieved descriptions and a object `baseFieldProps` which combines both the `form` and `descriptions` to easily pass them along to `Field` components.
 */
export default function useRHF<TSchema extends z.ZodSchema>(schema: TSchema, formProps?: {} & Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>, options?: UseRHFOptions<TSchema>) {
  const hasServerValidation = typeof options?.serverAction === 'function'
  const noopServerValidation: ServerValidationAction<TSchema> = async (prevState) => prevState
  const initialState: ServerActionState<TSchema> = { success: false }

  const [state, formAction] = useActionState((options?.serverAction ?? noopServerValidation) as ServerValidationAction<TSchema>, initialState)
  const [isPending, startTransition] = useTransition()

  const descriptions = extractDescriptionMap(schema)
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(state.values ?? ({} as DefaultValues<TSchema>)),
      ...formProps?.defaultValues,
    },
    ...formProps,
  })

  const callServerAction = useCallback(
    (values: z.infer<TSchema>) => {
      if (!hasServerValidation) return
      startTransition(() => {
        formAction(values)
      })
    },
    [hasServerValidation, formAction, startTransition],
  )

  const base = {
    form,
    descriptions,
    baseFieldProps: { form, descriptions },
  } as const

  if (!hasServerValidation) return base

  return { ...base, callServerAction, state }
}
