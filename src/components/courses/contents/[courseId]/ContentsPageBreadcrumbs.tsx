import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { getScopedI18n } from '@/src/i18n/server-localization'
import { Course } from '@/src/schemas/CourseSchema'

export async function ContentPageBreadcrumbs({ course }: { course: Course }) {
  const t = await getScopedI18n('Shared.Breadcrumbs')

  return (
    <Breadcrumb>
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
            <Link href={`/courses/edit/${course.id}`}>{course.name}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbPage>{t('contents')}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
