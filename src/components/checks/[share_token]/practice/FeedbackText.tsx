import Tooltip, { TooltipProps } from '@/src/components/Shared/Tooltip'

type ShowFeedbackTextProps = Pick<TooltipProps, 'side' | 'sideOffset' | 'disabled'> & {
  feedback?: string
  open?: boolean
  children: React.ReactNode
}
export default function DisplayFeedbackText(props: ShowFeedbackTextProps) {
  if (!props.feedback) return <>{props.children}</>
  return <Tooltip content={props.feedback} config={{ open: props.open }} className='max-w-[25vw] text-wrap' {...props} />
}
