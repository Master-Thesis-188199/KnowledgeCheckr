'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { getPublicKnowledgeChecks } from '@/database/knowledgeCheck/select'

type Props = NonNullable<Parameters<typeof getPublicKnowledgeChecks>['0']>

type DiscoverFilterContextProps = Props & {
  setFuncProps: Dispatch<SetStateAction<Props>>
}

const Context = createContext({} as DiscoverFilterContextProps)

export default function DiscoverFilterOptionsContext({ defaultProps, children }: { defaultProps?: Partial<DiscoverFilterContextProps>; children: React.ReactNode }) {
  const [funcProps, setFuncProps] = useState<Props>({ ...defaultProps })

  return <Context.Provider value={{ ...funcProps, setFuncProps }}>{children}</Context.Provider>
}

export function useDiscoverFilterOptionsContext() {
  const ctx = useContext(Context)

  if (!ctx) throw new Error('"useDiscoverFilterOptionsContext" may only be used when wrapped within Provider.')

  return ctx
}
