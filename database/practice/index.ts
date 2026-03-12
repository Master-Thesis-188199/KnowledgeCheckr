'use server'

import { and, eq } from 'drizzle-orm'
import getDatabase from '@/database/Database'
import { db_userHasDoneCourse } from '@/database/drizzle'
import { insertPracticeResults } from '@/database/practice/insert'
import { updatePracticeResults } from '@/database/practice/update'
import { PracticeState } from '@/src/hooks/checks/[share_token]/practice/PracticeStore'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'

export async function savePracticeResults(
  props: { results: PracticeState['results']; startedAt: PracticeState['startedAt'] } & Omit<
    typeof db_userHasDoneCourse.$inferInsert,
    'startedAt' | 'results' | 'finishedAt' | 'id' | 'userId' | 'type'
  >,
) {
  const {
    user: { id: userId },
  } = await requireAuthentication()

  const db = await getDatabase()

  const [update] = await db
    .select()
    .from(db_userHasDoneCourse)
    .where(
      and(
        eq(db_userHasDoneCourse.knowledgeCheckId, props.knowledgeCheckId),
        eq(db_userHasDoneCourse.startedAt, formatDatetime(props.startedAt)),
        eq(db_userHasDoneCourse.userId, userId),
        eq(db_userHasDoneCourse.type, 'practice'),
      ),
    )
    .limit(1)

  if (!update) return insertPracticeResults(props)

  return updatePracticeResults(props)
}
