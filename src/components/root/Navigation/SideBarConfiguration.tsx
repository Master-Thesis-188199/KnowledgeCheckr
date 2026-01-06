import { FolderSearchIcon, HouseIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { cn } from '@/src/lib/Shared/utils'

export const iconClasses = 'text-neutral-700 dark:text-neutral-200 size-6 flex-shrink-0 ml-[9px]'

export const sideBarConfiguration: SideBarProps = {
  title: 'KnowledgeCheckr',
  elements: [
    {
      label: 'Home',
      href: '/',
      icon: <HouseIcon className={cn(iconClasses, 'stroke-[1.7]')} />,
    },
    {
      label: 'Your Checks',
      href: '/checks',
      icon: <FolderSearchIcon className={iconClasses} />,
    },
    {
      label: 'Explore Checks',
      href: '/checks',
      icon: <SearchIcon className={iconClasses} />,
    },
    {
      label: 'Create New Check',
      href: '/checks/create',
      icon: <PlusIcon className={iconClasses} />,
    },
  ],
}
