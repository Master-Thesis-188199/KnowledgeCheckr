import GeneralSection from '@/src/app/checks/create/GeneralSection'
import QuestionsSection from '@/src/app/checks/create/QuestionsSection'
import { SaveCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import { CheckStoreProvider, CheckStoreProviderProps } from '@/src/components/check/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'

type CreateProps = Pick<CheckStoreProviderProps, 'options' | 'initialStoreProps'> & {
  mode: 'create'
}

type EditProps = Required<Pick<CheckStoreProviderProps, 'initialStoreProps'>> &
  Pick<CheckStoreProviderProps, 'options'> & {
    mode: 'edit'
  }

export function ConfigureKnowledgeCheck({ mode, initialStoreProps, options }: CreateProps | EditProps = { mode: 'create' }) {
  return (
    <CheckStoreProvider>
      <PageHeading title={`${mode === 'create' ? 'Create KnowledgeCheck' : initialStoreProps.name}`} />
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[repeat(auto-fill,minmax(680px,1fr))]'>
        <GeneralSection />
        <QuestionsSection />
        <SettingsSection />
        <Card className='h-60 break-inside-avoid' disableHoverStyles children={undefined} />
      </div>
      <form className='mt-4 flex justify-center gap-4'>
        <SaveCheckButton cacheKey={options?.cacheKey} />
      </form>
      <div />
    </CheckStoreProvider>
  )
}
