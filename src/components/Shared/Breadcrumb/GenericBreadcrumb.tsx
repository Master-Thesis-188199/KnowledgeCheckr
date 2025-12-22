'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react/jsx-runtime'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'

export function GenericBreadcrumb() {
  const pathname = usePathname()
  const pages = pathname.split('?').at(0)?.split('/')
  pages?.shift()

  return (
    <Breadcrumb className='mb-2'>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={'/'} className='capitalize'>
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pages?.map((p, i) => (
          <Fragment key={p}>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='capitalize'>
              {p === pages.at(-1) ? (
                <BreadcrumbPage>{p}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={'/' + pages.slice(0, i + 1).join('/')}>{p}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
