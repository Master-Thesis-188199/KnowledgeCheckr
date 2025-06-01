'use client'

import useMatchMedia from '@/hooks/Shared/useMatchMedia'

interface ConditionalBreakpointProps {
  children: React.ReactNode

  hideBreakPoint?: string
  showBreakPoint?: string
  logIdentifier?: string
}

export default function ConditionalBreakpointRendering({ children, showBreakPoint, hideBreakPoint, logIdentifier }: ConditionalBreakpointProps) {
  if (!showBreakPoint && !hideBreakPoint) throw new Error('[ConditionalBreakpointRendering]: Either showBreakPoint or hideBreakPoint must be provided')

  const mediaQuery = hideBreakPoint ? `(max-width: ${hideBreakPoint})` : `(min-width: ${showBreakPoint})`
  const matches = useMatchMedia(mediaQuery)

  if (!matches) {
    console.debug(`[ConditionalRendering]: ${logIdentifier ?? '[?]'} - was not rendered because the media-query "${mediaQuery}" did not match.`)
    return null
  }

  return <>{children}</>
}
