import { twMerge as tw } from 'tailwind-merge'
import SidebarHoverabilityDetection from '@/components/root/Navigation/desktop/SidebarHoverabilityDetection'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import DesktopSidebarDialog from '@/components/root/Navigation/desktop/DesktopSidebarDialog'
import SidebarUserBanner from '@/components/root/Navigation/elements/SidebarUserBanner'
import RenderSideBarItems from '@/components/root/Navigation/elements/RenderSideBarItems'
import AppVersion from '@/components/Shared/AppVersion'

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

        <ContentPanel children={children} />
        <SidebarHoverabilityDetection />
      </div>
    </div>
  )
}

function ContentPanel({ children }: { children?: React.ReactNode }) {
  return (
    <div className='@container flex flex-1'>
      <div className='flex flex-1 flex-col gap-2 overflow-auto rounded-tl-2xl rounded-bl-2xl border border-neutral-200 bg-gray-100 p-8 dark:border-neutral-700 dark:bg-neutral-900/60'>{children}</div>
    </div>
  )
}

function MenuBar() {
  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-neutral-600'>
      <span className='tracking-widest'>KnowledgeCheckr</span>
      <div className='flex items-center gap-2'>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
