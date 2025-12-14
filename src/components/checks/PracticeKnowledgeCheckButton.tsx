'use client'

import { Tooltip } from '@heroui/tooltip'
import { InfoIcon, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function PracticeKnowledgeCheckButton({ check, className }: { check: KnowledgeCheck; className?: string }) {
  const router = useRouter()

  return (
    <Tooltip
      content={
        <div className='flex items-center gap-1.5'>
          <InfoIcon className='size-4' />
          Practice Knowledge
        </div>
      }
      delay={250}
      offset={8}
      closeDelay={0}
      shouldFlip
      className='rounded-md bg-neutral-100 p-2 text-sm shadow-sm shadow-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-700'>
      <button
        aria-label='practice KnowledgeCheck'
        onClick={(e) => {
          e.preventDefault()
          router.push(`/checks/${check.share_key}/practice`)
        }}
        className='group/play p-1.5'>
        <PlayIcon className={cn('size-4.5 group-hover/play:animate-pulse group-hover/play:cursor-pointer dark:text-neutral-400 dark:group-hover/play:text-green-500/90', className)} />
      </button>
    </Tooltip>
  )
}
