import { useState } from 'react'
import Tooltip, { TooltipProps } from '@/src/components/Shared/Tooltip'

export type DisplayFeedbackTextProps = Pick<TooltipProps, 'side' | 'sideOffset' | 'disabled'> & {
  feedback?: string
  /**
   * the tooltip can be "pinned" when true, the tooltip stays open until the parent unpins it (used for mobile toggling / default-open wrong answers)
   * hover/focus behavior is preserved when tooltip is not pinned by parent, by listening for onOpenChange updates and updating `hoverOpen` state.
   */
  pinned?: boolean
  children: React.ReactNode
  answerIndex?: number
}

export default function DisplayFeedbackText({ feedback, pinned: isPinned, children, answerIndex = 0, ...props }: DisplayFeedbackTextProps) {
  const [hoverOpen, setHoverOpen] = useState(false)
  const open = isPinned || hoverOpen

  if (!feedback) return <>{children}</>

  return (
    <Tooltip
      content={
        <div className='flex flex-col gap-1'>
          <h2 className='text-sm font-medium'>Feedback for Answer {answerIndex + 1}</h2>
          <p>{feedback}</p>
        </div>
      }
      className='max-w-[50vw] text-wrap lg:max-w-[25vw]'
      config={{
        open,
        onOpenChange: (next) => {
          // when pinned, ignore hover-driven close/open events
          if (isPinned) return
          setHoverOpen(next)
        },
      }}
      {...props}>
      {children}
    </Tooltip>
  )
}
