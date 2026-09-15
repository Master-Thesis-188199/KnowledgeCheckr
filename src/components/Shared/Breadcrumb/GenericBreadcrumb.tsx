'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react/jsx-runtime'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { useCurrentLocale, useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

export function GenericBreadcrumb({ show = true }: { show?: boolean }) {
  const [breadcrumbExists, setBreadcrumbExists] = useState(false)
  const t = useScopedI18n('Shared.Breadcrumbs')
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
              {t('root')}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pages?.map((segment, i) => (
          <Fragment key={segment + i}>
            <BreadcrumbSeparator />
            <BreadcrumbItem className='capitalize'>
              {isCurrentPage(i) ? (
                <BreadcrumbPage>{t(segment as Any)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={'/' + pages.slice(0, i + 1).join('/')}>{t(segment as Any)}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
