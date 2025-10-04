import GeneralSection from '@/src/app/checks/create/GeneralSection'
import QuestionsSection from '@/src/app/checks/create/QuestionsSection'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'

export function OverviewSection() {
  return (
    <>
      <PageHeading title='Preview' />
      <div className='3xl:grid-cols-3 grid gap-8 xl:grid-cols-2 **:dark:[&_input]:ring-neutral-600/70 **:dark:[&_textarea]:ring-neutral-600/70' inert>
        <GeneralSection />
        <QuestionsSection />
        <SettingsSection />
        <Card disableHoverStyles children className='3xl:hidden' />
      </div>
    </>
  )
}
