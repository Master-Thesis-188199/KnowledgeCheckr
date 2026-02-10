import { twMerge } from 'tailwind-merge'
import { GenericBreadcrumb } from '@/src/components/Shared/Breadcrumb/GenericBreadcrumb'

export default async function PageHeading({ title, className, showBreadcrumbs = true, description }: { title: string; className?: string; showBreadcrumbs?: boolean; description?: string }) {
  return (
    <>
      <GenericBreadcrumb show={showBreadcrumbs} />
      <div className='mt-4 mb-8 flex flex-col gap-2'>
        <h1 id='page-heading' className={twMerge('text-[22px] font-semibold tracking-wider', className)}>
          {title}
        </h1>
        {description && (
          <p aria-label='page description' className='text-neutral-500 dark:text-neutral-400'>
            {description}
          </p>
        )}
      </div>
    </>
  )
}
