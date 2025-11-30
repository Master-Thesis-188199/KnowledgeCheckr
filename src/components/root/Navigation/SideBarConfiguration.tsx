import { BadgePlus, LayoutDashboard, List } from 'lucide-react'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { cn } from '@/src/lib/Shared/utils'

export const iconClasses = 'text-neutral-700 dark:text-neutral-200 size-6 flex-shrink-0 ml-[9px]'

export const sideBarConfiguration: SideBarProps = {
  title: 'KnowledgeCheckr',
  elements: [
    {
      label: 'Dashboard',
      href: '/',
      // icon: <BookOpenIcon className={iconClasses} />,
      icon: <LayoutDashboard className={cn(iconClasses, 'stroke-[1.7]')} />,
    },
    {
      label: 'Create New Check',
      href: '/checks/create',
      icon: <BadgePlus className={iconClasses} />,
    },
    {
      label: 'Show Checks',
      href: '/checks',
      icon: <List className={iconClasses} />,
    },
  ],
}
