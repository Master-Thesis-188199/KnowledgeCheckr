import { twMerge } from 'tailwind-merge'
import { GenericBreadcrumb } from '@/src/components/Shared/Breadcrumb/GenericBreadcrumb'

export default async function PageHeading({ title, className, showBreadcrumbs = true }: { title: string; className?: string; showBreadcrumbs?: boolean }) {
  return (
    <>
      <GenericBreadcrumb show={showBreadcrumbs} />
      <h1 className={twMerge('mb-8 text-[22px] font-semibold tracking-wider', className)}>{title}</h1>
    </>
  )
}
