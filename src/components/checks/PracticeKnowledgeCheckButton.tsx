'use client'

import { InfoIcon, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Tooltip from '@/src/components/Shared/Tooltip'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function PracticeKnowledgeCheckButton({ check, className }: { check: KnowledgeCheck; className?: string }) {
  const router = useRouter()
  const isEmpty = check.questions.length === 0 || check.share_key === null
  const tooltipMessage = isEmpty ? 'This check has no questions, cannot be practiced with at this moment.' : 'Practice Knowledge'

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
