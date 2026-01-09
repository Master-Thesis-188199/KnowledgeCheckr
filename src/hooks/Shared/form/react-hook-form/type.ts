import { UseFormProps, UseFormReturn } from 'react-hook-form'
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
  serverAction?: RHFServerAction<TSchema>
}

export type UseRHFFormProps<TSchema extends z.ZodSchema> = Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>

export type RHFBaseReturn<TSchema extends z.ZodSchema> = {
  form: UseFormReturn<z.infer<TSchema>>
  descriptions: ReturnType<typeof extractDescriptionMap>
  baseFieldProps: {
    form: UseFormReturn<z.infer<TSchema>>
    descriptions: ReturnType<typeof extractDescriptionMap>
  }
}

export type RHFSeverReturn<TSchema extends z.ZodSchema> = {
  runServerValidation: (values: z.infer<TSchema>) => void
  state: RHFServerState<TSchema>
  isServerValidationPending: boolean
}

export type RHFWithServerReturn<TSchema extends z.ZodSchema> = RHFBaseReturn<TSchema> & RHFSeverReturn<TSchema>
