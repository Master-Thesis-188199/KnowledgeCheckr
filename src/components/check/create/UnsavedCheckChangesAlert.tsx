'use client'

import { useCheckStore } from '@/src/components/check/create/CreateCheckProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { useEffect } from 'react'

export default function UnsavedCheckChangesAlert() {
  const { unsavedChanges } = useCheckStore((state) => state)
  const { enableNavigationAbort } = useNavigationAbort()

  useEffect(() => {
    if (!unsavedChanges) return

    enableNavigationAbort({
      title: 'You have unsaved changes. Discard?',
      description: 'By leaving the page now the changes you have made will be permanently lost.',
      dismissLabel: 'Continue Editing',
      continueLabel: 'Proceed without saving',
    })
  }, [unsavedChanges])

  return null
}
