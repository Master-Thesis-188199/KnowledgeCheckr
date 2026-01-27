import { getUsers } from '@/database/User/select'
import CollaboratorProviderContext from '@/src/components/checks/create/(sections)/CollaboratorProvider'
import GeneralSection from '@/src/components/checks/create/(sections)/GeneralSection'
import { OverviewSection } from '@/src/components/checks/create/(sections)/OverviewSection'
import QuestionsSection from '@/src/components/checks/create/(sections)/QuestionsSection'
import SettingsSection from '@/src/components/checks/create/(sections)/SettingsSection'
import { CheckStoreProvider, CheckStoreProviderProps } from '@/src/components/checks/create/CreateCheckProvider'
import { SaveCheckButton } from '@/src/components/checks/create/SaveCheckButton'
import { MultiStageBackButton, MultiStageNextButton } from '@/src/components/Shared/MultiStageProgress/MultiStageNavigationButtons'
import { MultiStageProgressBar } from '@/src/components/Shared/MultiStageProgress/MultiStageProgressBar'
import { MultiStageStoreProvider } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { MutliStageRenderer } from '@/src/components/Shared/MultiStageProgress/MutliStageRenderer'
import PageHeading from '@/src/components/Shared/PageHeading'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'

type CreateProps = Pick<CheckStoreProviderProps, 'initialStoreProps'> &
  Partial<Pick<CheckStoreProviderProps, 'options'>> & {
    mode: 'create'
  }

type EditProps = Required<Pick<CheckStoreProviderProps, 'initialStoreProps'>> &
  Pick<CheckStoreProviderProps, 'options'> & {
    mode: 'edit'
  }

export async function ConfigureKnowledgeCheck({ mode = 'create', initialStoreProps, options }: CreateProps | EditProps) {
  const { user } = await requireAuthentication()
  const users = await getUsers()

  return (
    <CheckStoreProvider initialStoreProps={{ owner_id: user.id, ...initialStoreProps }} options={options}>
      <MultiStageStoreProvider
        cacheOptions={{ cacheKey: 'create-check-stages' }}
        initialStoreProps={{
          stages: [
            { stage: 1, title: 'Basic Information' },
            { stage: 2, title: 'Questions' },
            { stage: 3, title: 'Settings' },
            { stage: 4, title: 'Conclusion' },
          ],
        }}>
        <PageHeading title={`${mode === 'create' ? 'Create KnowledgeCheck' : initialStoreProps?.name}`} />
        <MultiStageProgressBar className='-mt-2 mb-12' />

        <div className='mx-[1.5%] grid grid-cols-1 gap-8'>
          <CollaboratorProviderContext users={users}>
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
          </CollaboratorProviderContext>
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
