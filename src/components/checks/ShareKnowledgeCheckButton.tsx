'use client'

import { useState } from 'react'
import { Tooltip } from '@heroui/tooltip'
import { InfoIcon, Share2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { storeKnowledgeCheckShareToken } from '@/database/knowledgeCheck/insert'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function ShareKnowledgeCheckButton({ check, className }: { check: KnowledgeCheck; className?: string }) {
  const [shareToken, setShareToken] = useState(check.share_key)
  const router = useRouter()

  const isEmpty = check.questions.length === 0

  return (
    <Tooltip
      content={
        isEmpty ? (
          <>
            <div className='flex items-center gap-1.5'>
              <InfoIcon className='size-4 dark:text-red-400' />
              This check has no questions, cannot be shared at this moment.
            </div>
          </>
        ) : (
          <div className='flex items-center gap-1.5'>
            <InfoIcon className='size-4' />
            Share this KnowledgeCheck
          </div>
        )
      }
      delay={250}
      offset={8}
      closeDelay={0}
      shouldFlip
      className={cn(
        'rounded-md bg-neutral-100 p-2 text-sm shadow-sm shadow-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-700',
        isEmpty && 'dark:text-red-400/90 dark:shadow-red-400/40',
      )}>
      <button
        disabled={isEmpty}
        aria-label='share KnowledgeCheck'
        onClick={(e) => {
          e.preventDefault()

          if (shareToken) {
            navigator.clipboard
              .writeText(`${window.location.origin}/checks/${shareToken}/practice`)
              .then(() => toast('Successfully saved token to your clipboard.', { type: 'success' }))
              .catch(() => toast('Failed to copy share link to the clipboard.', { type: 'error' }))
            return
          }

          const token = generateToken()
          storeKnowledgeCheckShareToken(check.id, token)
            .then(() => {
              navigator.clipboard
                .writeText(`${window.location.origin}/checks/${token}/practice`)
                .then(() => toast('Successfully saved token to your clipboard.', { type: 'success' }))
                .catch(() => toast('Failed to copy share link to the clipboard.', { type: 'error' }))
              setShareToken(token)
              router.refresh()
              const pageHeading = document.querySelector('main h1')
              pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
            })
            .catch(() => toast('Failed to generate and save share-token', { type: 'error' }))
        }}
        className={cn(
          'group rounded-md p-1.5 enabled:hover:cursor-pointer enabled:hover:ring-1 disabled:cursor-not-allowed dark:text-neutral-400 dark:ring-neutral-500 disabled:dark:text-neutral-500',
          className,
        )}>
        <Share2Icon className='size-4.5 group-active:stroke-3' />
      </button>
    </Tooltip>
  )
}
