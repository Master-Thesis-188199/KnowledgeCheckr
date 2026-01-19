import { DefaultValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

export type RHFServerState<TSchema extends z.ZodSchema> = {
  success: boolean
  fieldErrors?: Partial<Record<keyof z.infer<TSchema>, string[]>>
  rootError?: string
  values?: Partial<z.infer<TSchema>>
}

export type RHFServerAction<TSchema extends z.ZodSchema> = (prev: RHFServerState<TSchema>, data: z.infer<TSchema>) => Promise<RHFServerState<TSchema>>

export type UseRHFOptions<TSchema extends z.ZodSchema> = {
  initialActionState: RHFServerState<TSchema>
  serverAction: RHFServerAction<TSchema>
}

export type UseRHFFormProps<TSchema extends z.ZodSchema> = Omit<UseFormProps<z.infer<TSchema>>, 'resolver' | 'defaultValues'> & {
  /**
   * Dynamically build the form default values
   * @param stateValues The values returned by the server-validation action, e.g. to preserver user-inputs after submission
   * @param instantiatedValues Property instantiations of the schema without default-values, thus string --> '', number --> 0, ...
   * @returns The form default values
   */
  defaultValues?: (stateValues: RHFServerState<TSchema>['values'], instantiatedValues: z.infer<TSchema>) => DefaultValues<z.infer<TSchema>>
}

export type RHFBaseReturn<TSchema extends z.ZodSchema> = {
  form: UseFormReturn<z.infer<TSchema>>
  descriptions: ReturnType<typeof extractDescriptionMap>
  baseFieldProps: {
    form: UseFormReturn<z.infer<TSchema>>
    descriptions: ReturnType<typeof extractDescriptionMap>
  }
}

export type RHFServerReturn<TSchema extends z.ZodSchema> = {
  runServerValidation: (values: z.infer<TSchema>) => void
  state: RHFServerState<TSchema>
  isServerValidationPending: boolean
}

export type RHFWithServerReturn<TSchema extends z.ZodSchema> = RHFBaseReturn<TSchema> & RHFServerReturn<TSchema>
