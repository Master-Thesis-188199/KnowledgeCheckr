'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react/jsx-runtime'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { useCurrentLocale } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'

export function GenericBreadcrumb({ show = true }: { show?: boolean }) {
  const [breadcrumbExists, setBreadcrumbExists] = useState(false)
  const locale = useCurrentLocale()
  const pathname = usePathname()
  const pages = pathname.split('?').at(0)!.split('/')!
  pages?.shift()

  // do not render the locale as a breadcrumb
  if (pages.includes(locale) && pages.indexOf(locale) === 0) pages.shift()

  const isCurrentPage = (index: number) => pages.length - 1 === index

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
          <Fragment key={p + i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='capitalize'>
              {isCurrentPage(i) ? (
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
