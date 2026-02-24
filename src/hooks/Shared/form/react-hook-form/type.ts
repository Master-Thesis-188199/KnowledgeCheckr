import { DefaultValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import { extractDescriptionMap } from '@/src/schemas/utils/extractDescriptions'

export type RHFServerState<Type extends object> = {
  success: boolean
  fieldErrors?: Partial<Record<keyof Type, string[]>>
  rootError?: string
  values?: Type
}

export type RHFServerAction<Type extends object> = (prev: RHFServerState<Type>, data: Type) => Promise<RHFServerState<Type>>

export type UseRHFOptions<Type extends object> = {
  initialActionState: RHFServerState<Type>
  serverAction: RHFServerAction<Type>
}

export type UseRHFFormProps<Type extends object> = Omit<UseFormProps<Type>, 'resolver' | 'defaultValues'> & {
  /**
   * Dynamically build the form default values
   * @param stateValues The values returned by the server-validation action, e.g. to preserver user-inputs after submission
   * @param instantiatedValues Property instantiations of the schema without default-values, thus string --> '', number --> 0, ...
   * @returns The form default values
   */
  defaultValues?: (stateValues: RHFServerState<Type>['values'], instantiatedValues: Type) => DefaultValues<Type>
}

export type RHFBaseReturn<Type extends object> = {
  form: UseFormReturn<Type>
  descriptions: ReturnType<typeof extractDescriptionMap>
  /**
   * This property is set to true when both the client- and server- validation is complete. Previously this state was manually declared and usually named as `isEvaluated`.
   */
  isValidationComplete: boolean
  baseFieldProps: {
    form: UseFormReturn<Type>
    descriptions: ReturnType<typeof extractDescriptionMap>
  }
}

export type RHFServerReturn<Type extends object> = {
  runServerValidation: (values: Type) => void
  state: RHFServerState<Type>
  isServerValidationPending: boolean
}

export type RHFWithServerReturn<Type extends object> = RHFBaseReturn<Type> & RHFServerReturn<Type>
