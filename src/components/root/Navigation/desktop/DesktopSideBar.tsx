import Image from 'next/image'
import { twMerge as tw } from 'tailwind-merge'
import DesktopSidebarDialog from '@/components/root/Navigation/desktop/DesktopSidebarDialog'
import SidebarHoverabilityDetection from '@/components/root/Navigation/desktop/SidebarHoverabilityDetection'
import RenderSideBarItems from '@/components/root/Navigation/elements/RenderSideBarItems'
import SidebarUserBanner from '@/components/root/Navigation/elements/SidebarUserBanner'
import SidebarContentPanel from '@/components/root/Navigation/SidebarContentPanel'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import AppVersion from '@/components/Shared/AppVersion'
import KnowledgeCheckrIcon from '@/public/KnowledgeCheckr.png'
import LanguageSwitcher from '@/src/components/i18n/LanguageSwitcher'
import ToggleSidebarButton from '@/src/components/root/Navigation/ToggleSidebarButton'
import { Separator } from '@/src/components/shadcn/separator'

export const DesktopSidebar = ({ className, children }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={tw('h-screen flex-col', className)}>
      <MenuBar />

      <div id='desktop-sidebar-container' className='mx-auto flex w-full flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800'>
        <DesktopSidebarDialog visibilityBreakpoints={className}>
          <RenderSideBarItems />

          <SidebarUserBanner />
          <AppVersion />
        </DesktopSidebarDialog>

        <SidebarContentPanel children={children} />
        <SidebarHoverabilityDetection />
      </div>
    </div>
  )
}

function MenuBar() {
  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-200'>
      <div className='2 flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <ToggleSidebarButton />
          <Separator orientation='vertical' className='min-h-5!' />
        </div>

        <Image src={KnowledgeCheckrIcon} alt='KnowledgeCheck-Icon' className='size-8' />
        <span className='tracking-widest'>KnowledgeCheckr</span>
      </div>
      <div className='flex items-center gap-2'>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
    </div>
  )
}
