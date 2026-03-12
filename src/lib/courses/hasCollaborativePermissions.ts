import { User } from 'better-auth'
import { Course } from '@/src/schemas/CourseSchema'

/**
 * This function checks whether a user is the owner or collaborator of a given course, thus whether he is able to e.g. edit.
 */
export default function hasCollaborativePermissions(course: Course, userId?: User['id']) {
  if (!userId) return false

  return course.owner_id === userId || course.collaborators.includes(userId)
}
