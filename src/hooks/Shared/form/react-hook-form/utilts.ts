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
