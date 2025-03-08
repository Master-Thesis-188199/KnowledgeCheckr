import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { ArrowLeftEndOnRectangleIcon, BookOpenIcon, Cog8ToothIcon } from '@heroicons/react/24/outline'

export const iconClasses = 'text-neutral-700 dark:text-neutral-200 size-6 flex-shrink-0 ml-[9px]'

export const sideBarConfiguration: SideBarProps = {
  title: 'KnowledgeCheckr',
  elements: [
    {
      label: 'Knowledge Dashboard',
      href: '#',
      icon: <BookOpenIcon className={iconClasses} />,
    },
    {
      label: 'Settings',
      href: '#',
      icon: <Cog8ToothIcon className={iconClasses} />,
    },
    {
      label: 'Logout',
      href: '#',
      icon: <ArrowLeftEndOnRectangleIcon className={iconClasses} />,
    },
  ],
}
