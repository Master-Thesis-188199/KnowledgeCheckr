import { isFuture } from 'date-fns/isFuture'
import { isPast } from 'date-fns/isPast'
import { getCurrentLocale, getScopedI18n } from '@/src/i18n/server-localization'
import { BetterAuthUser } from '@/src/lib/auth/server'
import { Course } from '@/src/schemas/CourseSchema'

type AllowedReturn = {
  allowed: true
  reason?: string
}

type NotAllowedReturn = {
  allowed: false
  reason: string
}

export default async function isExaminationAllowed(course: Course, user: BetterAuthUser): Promise<AllowedReturn | NotAllowedReturn> {
  const currentLocale = await getCurrentLocale()
  const t = await getScopedI18n('Examination.attempt_not_possible')
  if (!course.settings.examination.enableExaminations) return { allowed: false, reason: t('unavailable') }

  if (isFuture(course.settings.examination.startDate)) return { allowed: false, reason: t('notOpenYet', { openDate: course.settings.examination.startDate.toLocaleDateString(currentLocale) }) }
  if (course.settings.examination.endDate !== null && isPast(course.settings.examination.endDate))
    return { allowed: false, reason: t('checkClosed', { closeDate: course.settings.examination.endDate?.toLocaleDateString(currentLocale) }) }

  if (!course.settings.examination.allowAnonymous && user.isAnonymous) return { allowed: false, reason: t('anonymous-users-not-allowed') }

  return { allowed: true }
}
