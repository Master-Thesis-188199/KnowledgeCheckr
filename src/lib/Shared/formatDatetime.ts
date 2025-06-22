import { format } from 'date-fns'

export function formatDatetime(date: Date) {
  return format(date, 'yyyy-LL-dd HH:mm:ss')
}
