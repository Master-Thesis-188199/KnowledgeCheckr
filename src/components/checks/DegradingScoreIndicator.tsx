import Tooltip from '@/src/components/Shared/Tooltip'
import { cn } from '@/src/lib/Shared/utils'

/**
 *
 * @param knowledgeCheckScore A number between 0 and 100 where 100 means the user has likely retained 100% of the knowledge that he learned and had his exam about.
 */
export default function DegradingScoreIndicator({ knowledgeCheckScore, className }: { knowledgeCheckScore: number | undefined; className?: string }) {
  // very well retained, well-retained, good overview, mediocre, basic, lost
  let level: '95-100' | '80-95' | '60-80' | '40-60' | '20-40' | '0-20' | 'none' = 'none'

  if (knowledgeCheckScore === undefined) level = 'none'
  else if (knowledgeCheckScore >= 95) level = '95-100'
  else if (knowledgeCheckScore >= 80) level = '80-95'
  else if (knowledgeCheckScore >= 60) level = '60-80'
  else if (knowledgeCheckScore >= 40) level = '40-60'
  else if (knowledgeCheckScore >= 20) level = '20-40'
  else if (knowledgeCheckScore >= 0) level = '0-20'

  return (
    <Tooltip content='Estimated knowledge retainment'>
      <div
        className={cn(
          'relative text-xs select-none dark:bg-neutral-500/80',

          level === '0-20' && 'dark:bg-[oklch(55%_0.1_30)]',
          level === '20-40' && 'dark:bg-[oklch(50%_0.1_50)]',
          level === '40-60' && 'dark:bg-[oklch(50%_0.1_70)]',
          level === '60-80' && 'dark:bg-[oklch(50%_0.2_116)]',
          level === '80-95' && 'dark:bg-[oklch(45%_0.3_155)]',
          level === '95-100' && 'dark:bg-[oklch(55%_0.3_155)]',
          className,
        )}>
        {/* <CircleIcon className={cn('size-8 stroke-[1.5px]', knowledgeCheckScore === undefined && 'stroke-1')} /> */}
        {/* <span className='absolute inset-0 flex items-center justify-center'>{knowledgeCheckScore ?? 0}</span> */}
        <span className='flex items-center justify-center'>{knowledgeCheckScore ?? 0}</span>
      </div>
    </Tooltip>
  )
}
