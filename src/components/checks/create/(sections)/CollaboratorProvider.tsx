'use client'

import { createContext, useContext } from 'react'
import { db_user } from '@/database/drizzle/schema'

type CollaboratorProviderProps = {
  users: (typeof db_user.$inferSelect)[]
}

const Context = createContext<CollaboratorProviderProps | null>(null)

export default function CollaboratorProviderContext({ children, ...defaultProps }: { children: React.ReactNode } & CollaboratorProviderProps) {
  return <Context.Provider value={defaultProps}>{children}</Context.Provider>
}

export function useCollaboratorContext() {
  const ctx = useContext(Context)

  if (!ctx) throw new Error('Cannot access react-context outside of Provider (CollaboratorContext)')

  return ctx
}
