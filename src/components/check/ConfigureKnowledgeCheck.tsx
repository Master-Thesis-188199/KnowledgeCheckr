import GeneralSection from '@/src/app/checks/create/GeneralSection'
import QuestionsSection from '@/src/app/checks/create/QuestionsSection'
import { SaveCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import { OverviewSection } from '@/src/components/check/create/(sections)/OverviewSection'
import { CheckStoreProvider, CheckStoreProviderProps } from '@/src/components/check/create/CreateCheckProvider'
import { MultiStageBackButton, MultiStageNextButton } from '@/src/components/Shared/MultiStageProgress/MultiStageNavigationButtons'
import { MultiStageProgressBar } from '@/src/components/Shared/MultiStageProgress/MultiStageProgressBar'
import { MultiStageStoreProvider } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { MutliStageRenderer } from '@/src/components/Shared/MultiStageProgress/MutliStageRenderer'
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
    <CheckStoreProvider initialStoreProps={initialStoreProps} options={options}>
      <MultiStageStoreProvider
        initialStoreProps={{
          stages: [
            { stage: 1, title: 'Basic Information' },
            { stage: 2, title: 'Questions' },
            { stage: 3, title: 'Settings' },
            { stage: 4, title: 'Conclusion' },
          ],
        }}>
        <PageHeading title={`${mode === 'create' ? 'Create KnowledgeCheck' : initialStoreProps.name}`} />
        <MultiStageProgressBar className='-mt-2 mb-12' />

        <div className='mx-[1.5%] grid grid-cols-1 gap-8'>
          <MutliStageRenderer stage={1}>
            <GeneralSection />
          </MutliStageRenderer>
          <MutliStageRenderer stage={2}>
            <QuestionsSection />
          </MutliStageRenderer>

          <MutliStageRenderer stage={3}>
            <SettingsSection />
          </MutliStageRenderer>

          <MutliStageRenderer stage={4}>
            <OverviewSection />
          </MutliStageRenderer>
        </div>
        <div className='mx-[1.5%] mt-4 flex justify-between'>
          <MultiStageBackButton variant='outline' children='Back' />
          <MultiStageNextButton variant='primary' children='Next' />
        </div>
        <MutliStageRenderer stage={4}>
          <form className='mt-4 flex justify-center gap-4'>
            <SaveCheckButton />
          </form>
        </MutliStageRenderer>
        <div />
      </MultiStageStoreProvider>
    </CheckStoreProvider>
  )
}
