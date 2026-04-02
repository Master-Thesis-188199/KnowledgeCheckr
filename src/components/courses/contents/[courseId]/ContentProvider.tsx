'use client'

import { createContext, SetStateAction, useContext, useState } from 'react'
import { Course } from '@/src/schemas/CourseSchema'

type ContextProps = {
  currentContentIndex: number
  setCurrentIndex: React.Dispatch<SetStateAction<number>>
  contents: Course['contents']
}

const Context = createContext<ContextProps | null>(null)

export function ContentProvider({ children, initialProps }: { children: React.ReactNode; initialProps?: Partial<ContextProps> }) {
  const [currentIndex, setCurrentIndex] = useState(initialProps?.currentContentIndex ?? 0)

  return <Context.Provider value={{ currentContentIndex: currentIndex, setCurrentIndex, contents: [], ...initialProps }}>{children}</Context.Provider>
}

export function useContentContext() {
  const ctx = useContext(Context)

  if (!ctx) throw new Error('useContentContext may only be used within a <ContentProvider />')

  return ctx
}
