/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useEffect, useState } from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/src/components/shadcn/input-otp'
import SmoothPresenceTransition from '@/src/components/Shared/Animations/SmoothPresenceTransition'
import debounceFunction from '@/src/hooks/Shared/debounceFunction'

export default function ShareTokenOTP() {
  const [shareTokenInput, setShareTokenInput] = useState<string>('')
  const [status, setStatus] = useState<'fetching' | 'awaiting-input' | 'done' | 'not-found' | 'practice-only' | 'exam-only' | 'exam-and-practice'>('awaiting-input')

  const debouncedChange = debounceFunction((input: string) => {
    setStatus(input.trim().length > 0 ? 'fetching' : 'awaiting-input')
    setShareTokenInput(input)
  }, 350)

  useEffect(() => {
    if (status !== 'fetching') return
    if (shareTokenInput.trim().length === 0) return setStatus('awaiting-input')
    if (shareTokenInput.trim().length < 8) return setStatus('not-found')

    getKnowledgeCheckByShareToken(shareTokenInput)
      .then((check) => {
        if (!check) return setStatus('not-found')

        // todo set status based on what options are available
        setStatus('done')
      })
      .catch(() => setStatus('not-found'))
  }, [status])

  return (
    <>
      <div className='flex justify-center'>
        <InputOTP maxLength={8} onChange={debouncedChange}>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid={status === 'not-found'} />
            <InputOTPSlot index={1} aria-invalid={status === 'not-found'} />
            <InputOTPSlot index={2} aria-invalid={status === 'not-found'} />
            <InputOTPSlot index={3} aria-invalid={status === 'not-found'} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} aria-invalid={status === 'not-found'} />
            <InputOTPSlot index={5} aria-invalid={status === 'not-found'} />
            <InputOTPSlot index={6} aria-invalid={status === 'not-found'} />
            <InputOTPSlot index={7} aria-invalid={status === 'not-found'} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className='-mt-4'>
        <SmoothPresenceTransition
          active={status === 'fetching'}
          presenceTiming={{ minVisibleMs: 550 }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 1, margin: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='mt-4 flex items-center justify-center gap-2 text-muted-foreground'>
          <LoaderCircleIcon className='size-5 animate-spin' />
          Parsing token
        </SmoothPresenceTransition>
      </div>
    </>
  )
}
