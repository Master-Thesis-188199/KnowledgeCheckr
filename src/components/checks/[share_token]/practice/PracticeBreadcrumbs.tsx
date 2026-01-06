import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Link from 'next/link'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/src/components/shadcn/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
export function PracticeBreadcrumbs({
  share_token,
  selectedCategory: category,
  categories,
  ...props
}: { share_token: string; selectedCategory?: string; categories: string[] } & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <Breadcrumb {...props}>
      <BreadcrumbList>
        <BreadcrumbItem>Practice</BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={`/checks/${share_token}/practice/category`}>Category</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1' id='category-switcher'>
              <BreadcrumbPage>{category === '_none_' || category === undefined ? 'combined-questions' : category}</BreadcrumbPage>
              <span className='sr-only'>Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <Link
                data-category={'all'}
                replace
                href={{
                  pathname: `/checks/${share_token}/practice`,
                  query: { category: '_none_' },
                }}>
                <DropdownMenuItem className='rounded-b-none border-b border-b-neutral-500'>Combined Questions</DropdownMenuItem>
              </Link>
              {categories.map((categoryName) => (
                <Link
                  replace
                  data-category={categoryName}
                  key={categoryName}
                  href={{
                    pathname: `/checks/${share_token}/practice`,
                    query: { category: categoryName },
                  }}>
                  <DropdownMenuItem className='cursor-pointer'>{categoryName}</DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        <BreadcrumbSeparator />
        <BreadcrumbItem>Questions</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
