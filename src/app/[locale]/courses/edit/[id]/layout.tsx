import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseById } from '@/database/course/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'

export default async function EditLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params
  const course = await getCourseById(id)

  if (!course) notFound()

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink asChild>
            <Link href={`/`}>Home</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/courses`}>Courses</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Edit</BreadcrumbItem>

          <BreadcrumbSeparator />
          <BreadcrumbPage>{course.name}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </>
  )
}
