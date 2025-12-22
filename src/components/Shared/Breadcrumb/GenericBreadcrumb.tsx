'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react/jsx-runtime'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { cn } from '@/src/lib/Shared/utils'

export function GenericBreadcrumb({ show = true }: { show?: boolean }) {
  const [breadcrumbExists, setBreadcrumbExists] = useState(false)
  const pathname = usePathname()
  const pages = pathname.split('?').at(0)?.split('/')
  pages?.shift()

  useEffect(() => {
    const breadcrumbs = document.querySelectorAll('nav[aria-label="breadcrumb"]')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (breadcrumbs.length > 1) setBreadcrumbExists(true)
  }, [])

  if (!show) return null

  return (
    <Breadcrumb className={cn('mb-2', breadcrumbExists && 'hidden')}>
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
