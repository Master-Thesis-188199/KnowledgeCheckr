import { format } from 'date-fns'

export function formatDatetime(date: Date | string) {
  return format(date, 'yyyy-LL-dd HH:mm:ss')
}
