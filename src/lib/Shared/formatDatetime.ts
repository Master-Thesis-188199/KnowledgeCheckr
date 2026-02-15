import { format } from 'date-fns'

export function formatDatetime(date: Date | string) {
  // ensures that date instances that were stringified, e.g. due to caching are re-instantiated as a Date object before formatting.
  if (typeof date === 'string') date = new Date(Date.parse(date))

  return format(date, 'yyyy-LL-dd HH:mm:ss')
}
