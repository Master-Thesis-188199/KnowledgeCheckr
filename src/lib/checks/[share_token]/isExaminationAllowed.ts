import { isFuture } from 'date-fns/isFuture'
import { isPast } from 'date-fns/isPast'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function isExaminationAllowed(check: KnowledgeCheck) {
  if (!check.settings.examination.enableExaminations) return 'examinations-disabled'

  if (isFuture(check.settings.examination.startDate)) return 'examination window not yet open'
  if (check.settings.examination.endDate !== null && isPast(check.settings.examination.endDate)) return 'examination window closed'

  return 'allowed'
}
