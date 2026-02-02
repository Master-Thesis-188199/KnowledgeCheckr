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

  if (knowledgeCheckScore && knowledgeCheckScore > 100) knowledgeCheckScore = 100

  let scoreMessage: string = ''

  switch (level) {
    case '95-100': {
      scoreMessage = 'Almost 100% of the Knowledge is most likely still retained'
      break
    }
    case '80-95': {
      scoreMessage = 'Most of the Knowledge gained by this check is retained'
      break
    }
    case '60-80': {
      scoreMessage = 'Big Chunks of Knowledge are still retained'
      break
    }
    case '40-60': {
      scoreMessage = 'While some Knowledge parts are retained, a large part might have been forgotten'
      break
    }
    case '20-40': {
      scoreMessage = 'Most of the Knowledge delivered by this check is no longer retained'
      break
    }
    case '0-20': {
      scoreMessage = 'The contents and knowledge delivered by this check are no longer retained'
      break
    }
    case 'none':
  }

  return (
    <Tooltip content={scoreMessage} delay={100}>
      <div
        className={cn(
          'relative bg-neutral-300 text-xs select-none dark:bg-neutral-500/80',

          level === '0-20' && 'bg-[oklch(80%_0.25_30)] dark:bg-[oklch(40%_0.12_30)]',
          level === '20-40' && 'bg-[oklch(88%_0.08_45)] dark:bg-[oklch(30%_0.09_30)]',
          level === '40-60' && 'bg-[oklch(88%_0.08_110)] dark:bg-[oklch(32%_0.2_110)]',
          level === '60-80' && 'bg-[oklch(85%_0.08_116)] dark:bg-[oklch(32%_0.2_116)]',
          level === '80-95' && 'bg-[oklch(85%_0.10_155)] dark:bg-[oklch(35%_0.3_155)]',
          level === '95-100' && 'bg-[oklch(85%_0.2_140)] dark:bg-[oklch(40%_0.37_155)]',
          className,
        )}>
        <span className='flex items-center justify-center'>{knowledgeCheckScore ?? 0}</span>
      </div>
    </Tooltip>
  )
}
