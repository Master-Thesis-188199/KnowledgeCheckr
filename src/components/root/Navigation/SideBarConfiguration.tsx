import { FolderSearchIcon, HouseIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { cn } from '@/src/lib/Shared/utils'

export const iconClasses = 'text-neutral-700 dark:text-neutral-200 size-6 flex-shrink-0 ml-[9px]'

export const sideBarConfiguration: SideBarProps = {
  title: 'KnowledgeCheckr',
  elements: [
    {
      type: 'navigation',
      label: 'Home',
      href: '/',
      icon: <HouseIcon className={cn(iconClasses, 'stroke-[1.7]')} />,
    },
    {
      type: 'navigation',
      label: 'Your Checks',
      href: '/checks',
      icon: <FolderSearchIcon className={iconClasses} />,
    },
    {
      type: 'navigation',
      label: 'Discover Checks',
      href: '/checks/discover',
      icon: <SearchIcon className={iconClasses} />,
    },
    {
      type: 'separator',
      classes: 'h-0.5',
    },
    {
      type: 'navigation',
      label: 'Create New Check',
      href: '/checks/create',
      icon: <PlusIcon className={iconClasses} />,
    },
  ],
}
