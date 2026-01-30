import { isFuture } from 'date-fns/isFuture'
import { isPast } from 'date-fns/isPast'
import { BetterAuthUser } from '@/src/lib/auth/server'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function isExaminationAllowed(check: KnowledgeCheck, user: BetterAuthUser) {
  if (!check.settings.examination.enableExaminations) return 'examinations-disabled'

  if (isFuture(check.settings.examination.startDate)) return 'examination window not yet open'
  if (check.settings.examination.endDate !== null && isPast(check.settings.examination.endDate)) return 'examination window closed'

  if (!check.settings.examination.allowAnonymous && user.isAnonymous) return 'anonymous-users-not-allowed'

  return 'allowed'
}
