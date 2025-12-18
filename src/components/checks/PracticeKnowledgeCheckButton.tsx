'use client'

import { Tooltip } from '@heroui/tooltip'
import { InfoIcon, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function PracticeKnowledgeCheckButton({ check, className }: { check: KnowledgeCheck; className?: string }) {
  const router = useRouter()
  const isEmpty = check.questions.length === 0

  return (
    <Tooltip
      content={
        isEmpty ? (
          <>
            <div className='flex items-center gap-1.5'>
              <InfoIcon className='size-4 dark:text-red-400' />
              This check has no questions, cannot be practiced with at this moment.
            </div>
          </>
        ) : (
          <div className='flex items-center gap-1.5'>
            <InfoIcon className='size-4' />
            Practice Knowledge
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
        aria-label='practice KnowledgeCheck'
        onClick={(e) => {
          e.preventDefault()
          router.push(`/checks/${check.share_key}/practice`)
        }}
        className={cn(
          'group/play rounded-md p-1.5 enabled:hover:cursor-pointer disabled:hover:cursor-not-allowed dark:text-neutral-400 enabled:dark:group-hover/play:text-green-500/90 disabled:dark:text-neutral-500',
          className,
        )}>
        <PlayIcon className='size-4.5 enabled:group-hover/play:animate-pulse' />
      </button>
    </Tooltip>
  )
}
