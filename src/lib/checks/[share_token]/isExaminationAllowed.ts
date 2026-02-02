import { isFuture } from 'date-fns/isFuture'
import { isPast } from 'date-fns/isPast'
import { getCurrentLocale, getScopedI18n } from '@/src/i18n/server-localization'
import { BetterAuthUser } from '@/src/lib/auth/server'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

type AllowedReturn = {
  allowed: true
  reason?: string
}

type NotAllowedReturn = {
  allowed: false
  reason: string
}

export default async function isExaminationAllowed(check: KnowledgeCheck, user: BetterAuthUser): Promise<AllowedReturn | NotAllowedReturn> {
  const currentLocale = await getCurrentLocale()
  const t = await getScopedI18n('Examination.attempt_not_possible')
  if (!check.settings.examination.enableExaminations) return { allowed: false, reason: t('unavailable') }

  if (isFuture(check.settings.examination.startDate)) return { allowed: false, reason: t('notOpenYet', { openDate: check.settings.examination.startDate.toLocaleDateString(currentLocale) }) }
  if (check.settings.examination.endDate !== null && isPast(check.settings.examination.endDate))
    return { allowed: false, reason: t('checkClosed', { closeDate: check.settings.examination.endDate?.toLocaleDateString(currentLocale) }) }

  if (!check.settings.examination.allowAnonymous && user.isAnonymous) return { allowed: false, reason: t('anonymous-users-not-allowed') }

  return { allowed: true }
}
