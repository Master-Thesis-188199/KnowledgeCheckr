import GeneralSection from '@/src/components/checks/create/(sections)/GeneralSection'
import QuestionsSection from '@/src/components/checks/create/(sections)/QuestionsSection'
import SettingsSection from '@/src/components/checks/create/(sections)/SettingsSection'
import Card from '@/src/components/Shared/Card'

export function OverviewSection() {
  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-1'>
        <span children='Preview changes' className='text-xl font-semibold' />
        <p className='text-neutral-600 dark:text-neutral-300'>Here is a brief overview of what changes were made</p>
      </div>
      <div
        className='3xl:grid-cols-3 grid gap-8 xl:grid-cols-2 **:[&_input]:ring-neutral-300/70 **:dark:[&_input]:ring-neutral-600/70 **:[&_textarea]:ring-neutral-300/70 **:dark:[&_textarea]:ring-neutral-600/70'
        inert>
        <GeneralSection />
        <QuestionsSection />
        <SettingsSection />
        <Card disableInteractions children className='3xl:hidden' />
      </div>
    </>
  )
}
