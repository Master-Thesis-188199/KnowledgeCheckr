'use client'

import { useEffect } from 'react'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { useScopedI18n } from '@/src/i18n/client-localization'

export default function UnsavedCourseChangesAlert() {
  const t = useScopedI18n('Courses.Create.UnsavedChangesAlert')
  const { unsavedChanges } = useCourseStore((state) => state)
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
