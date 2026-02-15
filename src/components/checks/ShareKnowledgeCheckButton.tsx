'use client'

import { useEffect, useState } from 'react'
import { InfoIcon, Share2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { storeKnowledgeCheckShareToken } from '@/database/knowledgeCheck/insert'
import Tooltip from '@/src/components/Shared/Tooltip'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function ShareKnowledgeCheckButton({ check, className }: { check: KnowledgeCheck; className?: string }) {
  const t = useScopedI18n('Components.ShareKnowledgeCheckButton')
  const [shareToken, setShareToken] = useState(check.share_key)
  const router = useRouter()

  // Update share-key when the check has been modified, e.g. when the share-token was removed
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (shareToken !== check.share_key) setShareToken(check.share_key)
  }, [check.share_key, shareToken])

  const isEmpty = check.questions.length === 0
  const tooltipMessage = isEmpty ? t('tooltip_empty_message') : t('tooltip_message')

  return (
    <Tooltip
      showsError={isEmpty}
      content={
        <div className='flex items-center gap-1.5'>
          <InfoIcon className='size-4' />
          {tooltipMessage}
        </div>
      }>
      <button
        disabled={isEmpty}
        aria-label={t('tooltip_message')}
        data-share-button
        onClick={(e) => {
          e.preventDefault()

          if (shareToken) {
            navigator.clipboard
              .writeText(`${window.location.origin}/checks/${shareToken}/practice`)
              .then(() => toast(t('successfully_copied_toast_message'), { type: 'success' }))
              .catch(() => toast(t('failed_copy_toast_message'), { type: 'error' }))
            return
          }

          const token = generateToken()
          storeKnowledgeCheckShareToken(check.id, token)
            .then(() => {
              navigator.clipboard
                .writeText(`${window.location.origin}/checks/${token}/practice`)
                .then(() => toast(t('successfully_copied_toast_message'), { type: 'success' }))
                .catch(() => toast(t('failed_copy_toast_message'), { type: 'error' }))
              setShareToken(token)
              router.refresh()
              const pageHeading = document.querySelector('main #page-heading')
              pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
            })
            .catch(() => toast('Failed to generate and save share-token', { type: 'error' }))
        }}
        className={cn(
          'group rounded-md p-1.5 text-neutral-600 ring-neutral-400 enabled:hover:cursor-pointer enabled:hover:ring-1 disabled:cursor-not-allowed disabled:text-neutral-400 dark:text-neutral-400 dark:ring-neutral-500 disabled:dark:text-neutral-500',
          className,
        )}>
        <Share2Icon className='size-4.5 group-active:stroke-3' />
      </button>
    </Tooltip>
  )
}
