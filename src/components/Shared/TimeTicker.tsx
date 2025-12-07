'use client'

import { useEffect, useState } from 'react'
import { differenceInMilliseconds, formatDuration, isAfter } from 'date-fns'

/**
 * This component essentially returns / displays the time that is left until the `duration` is exceeded. When the `duration` is reached the `onTimeUp` callback will be called to e.g redirect the user.
 * @param start The date at which the user started his action
 * @param duration The max-time limit the user can use to finish a respective action
 * @returns The time left until the `duration` is reached.
 */
export function TimeTicker({ start, duration, onTimeUp }: { start: Date; duration: number; onTimeUp?: () => void }) {
  const [timeLeft, setTimeleft] = useState<string | null>(null)
  const endDate = new Date(new Date(Date.parse(start.toString())).getTime() + duration * 1000)

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = differenceInMilliseconds(endDate, new Date(Date.now()))
      const differenceDate = new Date(difference)

      if (!isAfter(endDate, new Date(Date.now()))) {
        console.info('Examination time limit reached..')
        clearInterval(interval)
        onTimeUp?.call(null)
        return
      }

      setTimeleft(
        formatDuration(
          { seconds: differenceDate.getSeconds(), minutes: differenceDate.getMinutes() || undefined, hours: differenceDate.getHours() - 1 || undefined },
          { zero: true, delimiter: ' and ' },
        ),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [endDate, start, duration])

  return <>{timeLeft}</>
}
