import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { getScopedI18n } from '@/src/i18n/server-localization'
export async function PracticeBreadcrumbs({
  share_token,
  selectedCategory: category,
  categories,
  ...props
}: { share_token: string; selectedCategory?: string; categories: string[] } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  const t = await getScopedI18n('Shared.Breadcrumbs')

  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>{t('practice')}</BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/courses/${share_token}/practice/category`}>{t('practice_category')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1' id='category-switcher'>
              <BreadcrumbPage>{category === '_none_' || category === undefined ? t('practice_category_all_label').toLowerCase().replace(/ /g, '-') : category}</BreadcrumbPage>
              <span className='sr-only'>{t('practice_category_all_sr_only')}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <Link
                data-category={'all'}
                replace
                href={{
                  pathname: `/courses/${share_token}/practice`,
                  query: { category: '_none_' },
                }}>
                <DropdownMenuItem className='rounded-b-none border-b border-b-neutral-500'>{t('practice_category_all_label')}</DropdownMenuItem>
              </Link>
              {categories.map((categoryName) => (
                <Link
                  replace
                  data-category={categoryName}
                  key={categoryName}
                  href={{
                    pathname: `/courses/${share_token}/practice`,
                    query: { category: categoryName },
                  }}>
                  <DropdownMenuItem className='cursor-pointer'>{categoryName}</DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        <BreadcrumbSeparator />
        <BreadcrumbItem>{t('practice_page')}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
