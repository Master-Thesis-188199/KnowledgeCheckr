import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { getScopedI18n } from '@/src/i18n/server-localization'
export async function PracticeResultsBreadcrumbs({ share_token, ...props }: { share_token: string } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
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
            <Link href={`/courses/${share_token}/practice`}>{t('practice')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbPage>{t('results')}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
