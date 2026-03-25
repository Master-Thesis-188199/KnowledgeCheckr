'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/src/components/shadcn/form'
import useRHF from '@/src/hooks/Shared/form/useRHF'

const schema = z.object({
  shareToken: z.string().toUpperCase().length(8),
})
export type ShareTokenInput = z.output<typeof schema>

type ShareTokenContextProps = {
  /**
   * Specifies whether the retrieval and computation of available options is done, thus whether the parsing process is finished.
   */
  isDone: boolean
  setIsDone: Dispatch<SetStateAction<boolean>>
}

const Context = createContext<ShareTokenContextProps | null>(null)

export default function ShareTokenFormContext({ children }: { children: React.ReactNode }) {
  const [isDone, setIsDone] = useState(false)
  const { form } = useRHF(schema, { mode: 'onChange', defaultValues: () => ({ shareToken: '' }), delayError: 400 })

  return (
    <Context.Provider value={{ isDone, setIsDone }}>
      <Form {...form}>{children}</Form>
    </Context.Provider>
  )
}

export function useShareTokenFormContext() {
  const parentContext = useContext(Context)
  if (!parentContext) throw new Error('zseShareTokenFormContext may only be used within a <ShareTokenFormContext> </ShareTokenFormContext> provider.')

  const formContext = useFormContext<ShareTokenInput>()
  if (!formContext) throw new Error('useFormContext may only be used within a <Form> </Form> provider.')

  return { ...formContext, ...parentContext }
}
