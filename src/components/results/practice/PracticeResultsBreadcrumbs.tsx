import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
export function PracticeResultsBreadcrumbs({ share_token, ...props }: { share_token: string } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/`}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/courses`}>Courses</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/courses/${share_token}/practice`}>Practice</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbPage>
          <BreadcrumbItem>Results</BreadcrumbItem>
        </BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
