'use server'

import { User } from 'better-auth'
import { getCourses } from '@/database/course/query'
import { db_course } from '@/database/drizzle/schema'
import { TableFilters } from '@/database/utils/buildWhere'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { Course } from '@/src/schemas/CourseSchema'

export async function getCoursesByOwner(user_id: User['id'], { limit = 10, offset = 0 }: { limit?: number; offset?: number } = {}) {
  await requireAuthentication()

  const courses = await getCourses({
    limit,
    offset,
    baseFilter: {
      owner_id: {
        value: user_id,
        op: 'eq',
      },
    },
  })

  return courses
}

export async function getCourseById(id: Course['id']) {
  await requireAuthentication()

  const courses = await getCourses({
    limit: 1,
    baseFilter: {
      id: {
        value: id,
        op: 'eq',
      },
    },
  })

  return courses.at(0)
}

export async function getCourseByShareToken(token: string) {
  const courses = await getCourses({
    limit: 1,
    baseFilter: {
      share_key: {
        value: token,
        op: 'eq',
      },
    },
  })

  return courses.at(0)
}

export async function getPublicCourses({ limit = 10, offset = 0, filter }: { limit?: number; offset?: number; filter?: TableFilters<typeof db_course> } = {}) {
  await requireAuthentication()

  const courses = await getCourses({
    limit,
    offset,
    baseFilter: filter,
  })

  return courses
}
