import { cn } from '@/src/lib/Shared/utils'

export default function SidebarContentPanel({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className='flex flex-1'>
      <main
        className={cn(
          '@container',
          'flex flex-1 flex-col gap-2 overflow-auto p-8 md:rounded-tl-2xl md:rounded-bl-2xl md:border md:border-neutral-200 md:bg-gray-100 md:dark:border-neutral-700 md:dark:bg-neutral-900/60',
          className,
        )}>
        {children}
      </main>
    </div>
  )
}
