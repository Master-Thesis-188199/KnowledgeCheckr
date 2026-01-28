import GeneralSection from '@/src/components/checks/create/(sections)/GeneralSection'
import QuestionsSection from '@/src/components/checks/create/(sections)/QuestionsSection'
import SettingsSection from '@/src/components/checks/create/(sections)/SettingsSection'
import { getScopedI18n } from '@/src/i18n/server-localization'

export async function OverviewSection() {
  const t = await getScopedI18n('Checks.Create.OverviewSection')

  return (
    <>
      <div className='mt-4 mb-8 flex flex-col gap-1'>
        <span className='text-xl font-semibold'>{t('title')}</span>
        <p className='text-neutral-600 dark:text-neutral-300'>{t('description')}</p>
      </div>
      <div className='grid gap-8 xl:grid-cols-2 **:[&_input]:ring-neutral-300/70 **:dark:[&_input]:ring-neutral-600/70 **:[&_textarea]:ring-neutral-300/70 **:dark:[&_textarea]:ring-neutral-600/70'>
        <GeneralSection disabled jumpBackButton />
        <QuestionsSection disabled jumpBackButton />
        <SettingsSection disabled jumpBackButtons className='xl:col-span-2' />
      </div>
    </>
  )
}
