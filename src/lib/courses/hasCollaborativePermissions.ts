import { User } from 'better-auth'
import { Course } from '@/src/schemas/CourseSchema'

/**
 * This function checks whether a user is the owner or collaborator of a given check, thus whether he is able to e.g. edit.
 */
export default function hasCollaborativePermissions(check: Course, userId?: User['id']) {
  if (!userId) return false

  return check.owner_id === userId || check.collaborators.includes(userId)
}
