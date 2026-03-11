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
import debounceFunction from '@/src/hooks/Shared/debounceFunction'
import { useScopedI18n } from '@/src/i18n/client-localization'

export default function ShareTokenOptions() {
  const t = useScopedI18n('StartOptionsPage.ShareTokenOptions')
  const {
    isDone,
    setIsDone,
    formState: { isValid },
    getValues,
    ...form
  } = useShareTokenFormContext()
  const token = getValues().shareToken

  const [status, setStatus] = useState<'waiting' | 'practice-only' | 'exam-only' | 'both'>('waiting')
  const [input, setInput] = useState<string>('')
  const debounceInput = debounceFunction((input) => {
    setInput(input)
  }, 350)

  // indirectly re-validates options by applying updated token when the form remains to be valid but has changed; by changing input state.
  useEffect(() => {
    if (input === getValues().shareToken) return

    debounceInput(getValues().shareToken)

    return () => debounceInput.abort()
  }, [getValues, getValues().shareToken])

  useEffect(() => {
    if (!isValid) {
      // clear options, when user changed input which made the form-input inValid again.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('waiting')
      return
    }

    let aborted = false

    getKnowledgeCheckByShareToken(token)
      .then((check) => {
        if (aborted) return

        if (!check) {
          form.setError('root', { message: t('not_found_error_message') })
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
      .catch(() => (aborted ? null : form.setError('root', { message: t('retrieval_error_message') })))

    return () => {
      aborted = true
    }
  }, [isValid, input])

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
          {t('start_practice_label')}
          <ExternalLinkIcon />
        </Button>
      </Link>
      <Link href={`/checks/${token}/`} className='flex-1' tabIndex={-1}>
        <Button variant='base' className='flex min-h-12 w-full items-center justify-center rounded-md'>
          {t('start_examination_label')}
          <ExternalLinkIcon />
        </Button>
      </Link>
    </SmoothPresenceTransition>
  )
}
