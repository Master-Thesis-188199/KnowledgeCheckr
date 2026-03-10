'use client'

import { useEffect, useState } from 'react'
import { isAfter } from 'date-fns/isAfter'
import { isBefore } from 'date-fns/isBefore'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { useShareTokenFormContext } from '@/src/components/checks/start/ShareTokenFormContext'
import { Button } from '@/src/components/shadcn/button'
import SmoothPresenceTransition from '@/src/components/Shared/Animations/SmoothPresenceTransition'

export default function ShareTokenOptions() {
  const {
    isDone,
    setIsDone,
    formState: { isValid },
    getValues,
    ...form
  } = useShareTokenFormContext()
  const token = getValues().shareToken

  const [status, setStatus] = useState<'waiting' | 'practice-only' | 'exam-only' | 'both'>('waiting')

  useEffect(() => {
    if (!isValid) return
    let aborted = false

    getKnowledgeCheckByShareToken(token)
      .then((check) => {
        if (aborted) return

        if (!check) {
          form.setError('root', { message: 'Check was not found.' })
          setStatus('waiting')
          return
        }

        if (
          check.settings.practice.enablePracticing &&
          check.settings.examination.enableExaminations &&
          isBefore(check.settings.examination.startDate, new Date(Date.now())) &&
          (check.settings.examination.endDate === null || isAfter(check.settings.examination.endDate, new Date(Date.now())))
        )
          return setStatus('both')

        if (
          check.settings.practice.enablePracticing &&
          !(
            check.settings.examination.enableExaminations &&
            isBefore(check.settings.examination.startDate, new Date(Date.now())) &&
            (check.settings.examination.endDate === null || isAfter(check.settings.examination.endDate, new Date(Date.now())))
          )
        )
          return setStatus('practice-only')

        if (
          !check.settings.practice.enablePracticing &&
          check.settings.examination.enableExaminations &&
          isBefore(check.settings.examination.startDate, new Date(Date.now())) &&
          (check.settings.examination.endDate === null || isAfter(check.settings.examination.endDate, new Date(Date.now())))
        )
          return setStatus('exam-only')
      })
      .catch(() => (aborted ? null : form.setError('root', { message: 'Searching for check failed unexpectedly.' })))

    return () => {
      aborted = true
    }
  }, [isValid])

  useEffect(() => {
    if (status === 'waiting' && isDone) {
      setIsDone(false)
      return
    }

    if (!isDone && status !== 'waiting') setIsDone(true)
  }, [status])

  return (
    <SmoothPresenceTransition
      active={isDone}
      presenceTiming={{ showDelayMs: 300 }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 1, margin: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className='flex justify-center gap-6 text-muted-foreground'>
      <Link href={`/checks/${token}/practice`} className='flex-1' tabIndex={-1}>
        <Button variant='base' className='flex min-h-12 w-full items-center justify-center rounded-md'>
          Start Practicing
          <ExternalLinkIcon />
        </Button>
      </Link>
      <Link href={`/checks/${token}/`} className='flex-1' tabIndex={-1}>
        <Button variant='base' className='flex min-h-12 w-full items-center justify-center rounded-md'>
          Start Examination Attempt
          <ExternalLinkIcon />
        </Button>
      </Link>
    </SmoothPresenceTransition>
  )
}
