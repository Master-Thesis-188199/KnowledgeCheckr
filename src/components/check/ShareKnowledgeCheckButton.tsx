'use client'

import { saveGeneratedShareToken } from '@/src/lib/Shared/generateToken'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Tooltip } from '@heroui/tooltip'
import { InfoIcon, Share2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

export function ShareKnowledgeCheckButton({ check, className }: { check: KnowledgeCheck; className?: string }) {
  const [shareToken, setShareToken] = useState(check.share_key)

  return (
    <Tooltip
      content={
        <div className='flex items-center gap-1.5'>
          <InfoIcon className='size-4' />
          Share this KnowledgeCheck
        </div>
      }
      delay={250}
      offset={8}
      closeDelay={0}
      shouldFlip
      className='rounded-md bg-neutral-100 p-2 text-sm shadow-sm shadow-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-700'>
      <button
        aria-label='share KnowledgeCheck'
        onClick={(e) => {
          e.preventDefault()

          if (shareToken) {
            navigator.clipboard
              .writeText(`${window.location.origin}/checks/${shareToken}`)
              .then(() => toast('Successfully saved token to your clipboard.', { type: 'success' }))
              .catch(() => toast('Failed to copy share link to the clipboard.', { type: 'error' }))
            return
          }

          saveGeneratedShareToken(check.id)
            .then((token) => {
              navigator.clipboard
                .writeText(`${window.location.origin}/checks/${token}`)
                .then(() => toast('Successfully saved token to your clipboard.', { type: 'success' }))
                .catch(() => toast('Failed to copy share link to the clipboard.', { type: 'error' }))
              setShareToken(token)
            })
            .catch(() => toast('Failed to generate and save share-token', { type: 'error' }))
        }}
        className={cn('group rounded-md p-1.5 hover:cursor-pointer hover:ring-1 dark:text-neutral-400 dark:ring-neutral-500', className)}>
        <Share2Icon className='size-4.5 group-active:stroke-3' />
      </button>
    </Tooltip>
  )
}
