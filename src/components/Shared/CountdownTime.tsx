'use client'

import { useCallback, useEffect, useState } from 'react'
import { addSeconds, differenceInMilliseconds, formatDuration, isAfter } from 'date-fns'

/**
 * This component essentially returns / displays the time that is left until the `duration` is exceeded. When the `duration` is reached the `onTimeUp` callback will be called to e.g redirect the user.
 * @param start The date at which the user started his action
 * @param duration The max-time limit the user can use to finish a respective action
 * @returns The time left until the `duration` is reached.
 */
export function CountdownTime({ start: rawStartDate, duration, onTimeUp }: { start: Date; duration: number; onTimeUp?: () => void }) {
  const [remainingTime, setRemainingTime] = useState<string | null>(null)
  const [startDate] = useState(new Date(Date.parse(rawStartDate.toString()))) //* ensure date-object even if stringified
  const [endDate] = useState(addSeconds(startDate, duration))

  const computeDifference = useCallback(() => {
    const difference = differenceInMilliseconds(endDate, new Date(Date.now()))
    const differenceDate = new Date(difference)

    setRemainingTime(
      formatDuration(
        { seconds: differenceDate.getSeconds(), minutes: differenceDate.getMinutes() || undefined, hours: differenceDate.getHours() - 1 || undefined },
        { zero: true, delimiter: ' and ' },
      ),
    )
  }, [startDate, duration, setRemainingTime, endDate])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    computeDifference() //* set remainingTime immediately after component is rendered, so that there is no delay (first-interval) until time is rendered.

    const interval = setInterval(() => {
      if (!isAfter(endDate, new Date(Date.now()))) {
        console.info('Examination time limit reached..')
        clearInterval(interval)
        onTimeUp?.call(null)
        return
      }

      computeDifference()
    }, 1000)

    return () => clearInterval(interval)
  }, [duration, endDate, computeDifference, onTimeUp])

  return <>{remainingTime}</>
}
