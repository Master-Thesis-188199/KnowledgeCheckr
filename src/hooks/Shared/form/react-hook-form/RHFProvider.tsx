import { createContext, ReactNode, useContext } from 'react'
import { Form } from '@/src/components/shadcn/form'
import { RHFBaseReturn, RHFServerReturn } from '@/src/hooks/Shared/form/react-hook-form/type'
import { Any } from '@/types'

type RHFContext<T extends object> = RHFBaseReturn<T> & Partial<RHFServerReturn<T>>

const RHFContext = createContext<RHFContext<Any> | null>(null)

export function useRHFContext<T extends object>(serverValidation: false): RHFBaseReturn<T>
export function useRHFContext<T extends object>(serverValidation: true): RHFBaseReturn<T> & RHFServerReturn<T>
export function useRHFContext<T extends object>(serverValidation: boolean) {
  const context = useContext(RHFContext)
  if (!context) {
    throw new Error('useRHFContext must be used within a RHFProvider')
  }

  if (!serverValidation) return context as RHFBaseReturn<T>

  if ((context as Partial<RHFServerReturn<T>>).runServerValidation === undefined)
    throw new Error(`useRHFContext with 'serverValidation' enabled can only be used when the respective 'useRHF' declaration uses a server-action.`)

  return context as RHFServerReturn<T>
}

export const RHFProvider = <T extends object>({ children, ...props }: { children: ReactNode } & RHFContext<T>) => {
  return (
    <RHFContext.Provider value={props}>
      <Form {...props.form}>{children}</Form>
    </RHFContext.Provider>
  )
}
