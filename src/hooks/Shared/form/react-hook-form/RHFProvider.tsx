import { createContext, ReactNode, useContext } from 'react'
import { Form } from '@/src/components/shadcn/form'
import { RHFBaseReturn, RHFServerReturn } from '@/src/hooks/Shared/form/react-hook-form/type'
import { Any } from '@/types'

type RHFContext<T extends object> = RHFBaseReturn<T> & Partial<RHFServerReturn<T>>

const RHFContext = createContext<RHFContext<Any> | null>(null)

export const useRHFContext = <T extends object>() => {
  const context = useContext(RHFContext)
  if (!context) {
    throw new Error('useRHFContext must be used within a RHFProvider')
  }
  return context as RHFContext<T>
}

export const RHFProvider = <T extends object>({ children, ...props }: { children: ReactNode } & RHFContext<T>) => {
  return (
    <RHFContext.Provider value={props}>
      <Form {...props.form}>{children}</Form>
    </RHFContext.Provider>
  )
}
