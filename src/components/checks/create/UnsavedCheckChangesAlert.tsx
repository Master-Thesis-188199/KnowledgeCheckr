'use client'

import { useEffect } from 'react'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { useScopedI18n } from '@/src/i18n/client-localization'

export default function UnsavedCheckChangesAlert() {
  const t = useScopedI18n('Checks.Create.UnsavedChangesAlert')
  const { unsavedChanges } = useCheckStore((state) => state)
  const { enableNavigationAbort } = useNavigationAbort()

  useEffect(() => {
    if (!unsavedChanges) return

    enableNavigationAbort({
      title: t('title'),
      description: t('description'),
      dismissLabel: t('dismissLabel'),
      continueLabel: t('continueLabel'),
    })
  }, [unsavedChanges])

  return null
}
