import GeneralSection from '@/src/app/checks/create/GeneralSection'
import QuestionsSection from '@/src/app/checks/create/QuestionsSection'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import Card from '@/src/components/Shared/Card'

export function OverviewSection() {
  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-1'>
        <span children='Preview changes' className='text-xl font-semibold' />
        <p className='dark:text-neutral-300'>Here is a brief overview of what changes were made</p>
      </div>
      <div className='3xl:grid-cols-3 grid gap-8 xl:grid-cols-2 **:dark:[&_input]:ring-neutral-600/70 **:dark:[&_textarea]:ring-neutral-600/70' inert>
        <GeneralSection />
        <QuestionsSection />
        <SettingsSection />
        <Card disableHoverStyles children className='3xl:hidden' />
      </div>
    </>
  )
}
