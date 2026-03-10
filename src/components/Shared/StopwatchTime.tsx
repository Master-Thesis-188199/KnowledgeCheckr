'use client'

import { useCallback, useEffect, useState } from 'react'
import { differenceInMilliseconds, formatDuration } from 'date-fns'

/**
 * This component essentially returns / displays the time that a user e.g. spents on a page.
 * @param start The date at which the user started his action
 * @param delimiter Defines how the time-segments are separeted. By default: ` and `.
 * @returns The time that has passed since the `start`
 */
export function StopwatchTime({ start: rawStartDate, delimiter = ' and ' }: { start: Date; delimiter?: string }) {
  const [timeSpent, setTimeSpent] = useState<string | null>(null)
  const [startDate] = useState(new Date(Date.parse(rawStartDate.toString()))) //* ensure date-object even if stringified

  const computeDifference = useCallback(() => {
    const difference = differenceInMilliseconds(new Date(Date.now()), startDate)
    const differenceDate = new Date(difference)

    setTimeSpent(
      formatDuration({ seconds: differenceDate.getSeconds(), minutes: differenceDate.getMinutes() || undefined, hours: differenceDate.getHours() - 1 || undefined }, { zero: true, delimiter }),
    )
  }, [startDate, setTimeSpent, delimiter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeDifference() //* set time-spent immediately after component is rendered, so that there is no delay (first-interval) until time is rendered.

    const interval = setInterval(() => {
      computeDifference()
    }, 1000)

    return () => clearInterval(interval)
  }, [computeDifference])

  return <>{timeSpent}</>
}
