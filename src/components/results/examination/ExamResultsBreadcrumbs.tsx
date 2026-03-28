'use server'

import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Link from 'next/link'
import { getCourseById } from '@/database/course/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { getScopedI18n } from '@/src/i18n/server-localization'
import { Course } from '@/src/schemas/CourseSchema'

async function BaseBreadcrumbs({
  courseName,
  courseId,
  children,
  ...props
}: { children: React.ReactNode; courseId: Course['id']; courseName: Course['name'] } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const t = await getScopedI18n('Shared.Breadcrumbs')
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/`}>{t('root')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/courses`}>{t('courses')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/courses/${courseId}/edit`}>{courseName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export async function ExamResultsBreadcrumbs({ courseId, ...props }: { courseId: string } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const t = await getScopedI18n('Shared.Breadcrumbs')
  const course = await getCourseById(courseId)
  if (!course) return null

  return (
    <BaseBreadcrumbs courseId={courseId} courseName={course.name} {...props}>
      <BreadcrumbPage>
        <BreadcrumbItem>{t('examination_results')}</BreadcrumbItem>
      </BreadcrumbPage>
    </BaseBreadcrumbs>
  )
}

export async function ExamResultAttemptResultsBreadcrumbs({ courseId, userName, ...props }: { courseId: string; userName: string } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const t = await getScopedI18n('Shared.Breadcrumbs')
  const course = await getCourseById(courseId)
  if (!course) return null

  return (
    <BaseBreadcrumbs courseId={courseId} courseName={course.name} {...props}>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/results/${course.id}/exam`}>{t('examination_results')}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />

      <BreadcrumbPage>
        <BreadcrumbItem>
          {userName}&apos;s {t('results')}
        </BreadcrumbItem>
      </BreadcrumbPage>
    </BaseBreadcrumbs>
  )
}
