import { db_knowledgeCheck } from '@/database/drizzle/schema'
import { formatDatetime } from '@/src/lib/Shared/formatDatetime'
import { Course } from '@/src/schemas/KnowledgeCheck'

export function convertToDatabaseCourse(course: Course): typeof db_knowledgeCheck.$inferInsert {
  return {
    ...course,
    openDate: formatDatetime(course.openDate),
    createdAt: course.createdAt ? formatDatetime(course.createdAt) : undefined,
    updatedAt: course.updatedAt ? formatDatetime(course.updatedAt) : undefined,
    closeDate: course.closeDate ? formatDatetime(course.closeDate) : undefined,
    owner_id: course.owner_id,
  }
}
