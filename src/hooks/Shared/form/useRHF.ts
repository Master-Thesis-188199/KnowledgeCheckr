'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormProps } from 'react-hook-form'
import { z } from 'zod'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

/**
 * This hook is used to combine the initialization of a react-hook-form and the retrieval of the schema descriptions into one.
 * @param schema The schema used to validate the form and to retrieve its respective fields descriptions.
 * @param formProps The properties used to configure the react-hook-form form.
 * @returns The created react-hook-form form instance, the retrieved descriptions and a object `baseFieldProps` which combines both the `form` and `descriptions` to easily pass them along to `Field` components.
 */
export default function useRHF<TSchema extends z.ZodSchema>(schema: TSchema, formProps?: {} & Omit<UseFormProps<z.infer<TSchema>>, 'resolver'>) {
  const descriptions = extractDescriptionMap(schema)
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...formProps,
  })

  return { form, descriptions, baseFieldProps: { form, descriptions } }
}
