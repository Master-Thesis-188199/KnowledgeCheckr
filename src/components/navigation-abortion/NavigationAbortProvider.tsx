'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import NavigationAbortModel, { INavigationAbortContext, INavigationAbortModalContent } from './NavigationAbortModal'

const NavigationAbortContext = createContext<INavigationAbortContext | undefined>(undefined)

export default function NavigationAbortProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<INavigationAbortModalContent | undefined>(undefined)
  const [showModal, setShowModal] = useState<boolean>(false)

  const context = useMemo(
    (): INavigationAbortContext => ({
      content,
      setContent,
      showModal,
      setShowModal,
    }),
    [content, setContent, showModal, setShowModal],
  )

  return (
    <NavigationAbortContext.Provider value={context}>
      {children}
      <NavigationAbortModel {...context} />
    </NavigationAbortContext.Provider>
  )
}

export function useNavigationAbort() {
  const context = useContext(NavigationAbortContext)

  if (context === undefined) {
    throw new Error('useNavigationAbort must be called within <NavigationAbortProvider />')
  }

  const { setContent, content, setShowModal } = context

  const enableNavigationAbort = useCallback(
    function enableNavigationAbort(props: INavigationAbortModalContent) {
      setContent(props)
    },
    [setContent],
  )

  const clearNavigationAbort = useCallback(() => {
    setContent(undefined)
  }, [setContent])

  const showNavigationAbortModal = useCallback(
    (continueHref: string) => {
      setContent((currentContent) => ({
        ...currentContent,
        continueHref,
      }))
      setShowModal(true)
    },
    [setContent, setShowModal],
  )

  return useMemo(
    () => ({
      enableNavigationAbort,
      clearNavigationAbort,
      isNavigationAbortSet: content !== undefined,
      showNavigationAbortModal,
    }),
    [enableNavigationAbort, clearNavigationAbort, content, showNavigationAbortModal],
  )
}
