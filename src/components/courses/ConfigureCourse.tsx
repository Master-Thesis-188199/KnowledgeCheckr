import { getUsers } from '@/database/User/select'
import CollaboratorProviderContext from '@/src/components/courses/create/(sections)/CollaboratorProvider'
import GeneralSection from '@/src/components/courses/create/(sections)/GeneralSection'
import { OverviewSection } from '@/src/components/courses/create/(sections)/OverviewSection'
import QuestionsSection from '@/src/components/courses/create/(sections)/QuestionsSection'
import SettingsSection from '@/src/components/courses/create/(sections)/SettingsSection'
import { CourseStoreProvider, CourseStoreProviderProps } from '@/src/components/courses/create/CreateCourseProvider'
import { SaveCourseButton } from '@/src/components/courses/create/SaveCourseButton'
import { MultiStageBackButton, MultiStageNextButton } from '@/src/components/Shared/MultiStageProgress/MultiStageNavigationButtons'
import { MultiStageProgressBar } from '@/src/components/Shared/MultiStageProgress/MultiStageProgressBar'
import { MultiStageStoreProvider } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { MutliStageRenderer } from '@/src/components/Shared/MultiStageProgress/MutliStageRenderer'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import getReferer from '@/src/lib/Shared/getReferer'

type CreateProps = Pick<CourseStoreProviderProps, 'initialStoreProps'> &
  Partial<Pick<CourseStoreProviderProps, 'options'>> & {
    mode: 'create'
  }

type EditProps = Required<Pick<CourseStoreProviderProps, 'initialStoreProps'>> &
  Pick<CourseStoreProviderProps, 'options'> & {
    mode: 'edit'
  }

export async function ConfigureCourse({ mode = 'create', initialStoreProps, options }: CreateProps | EditProps) {
  const { user } = await requireAuthentication()
  const users = await getUsers()
  const tButtons = await getScopedI18n('Shared')
  const t = await getScopedI18n('Checks.Create.MultiStages')

  // when users start editing from e.g. '/discover', '/courses' redirect them back to that page after save. When creating new courses redirect to '/courses'
  const callbackPath = mode === 'edit' ? await getReferer() : '/courses'

  return (
    <CourseStoreProvider initialStoreProps={{ owner_id: user.id, ...initialStoreProps }} options={options}>
      <MultiStageStoreProvider
        cacheOptions={{ cacheKey: 'create-check-stages' }}
        initialStoreProps={{
          stages: [
            { stage: 1, title: t('basic-information') },
            { stage: 2, title: t('questions') },
            { stage: 3, title: t('settings') },
            { stage: 4, title: t('conclusion') },
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
          <MultiStageBackButton variant='outline' children={tButtons('navigation_button_previous')} />
          <MultiStageNextButton variant='primary' children={tButtons('navigation_button_next')} />
        </div>
        <MutliStageRenderer stage={4}>
          <form className='mt-4 flex justify-center gap-4'>
            <SaveCourseButton callbackPath={callbackPath} />
          </form>
        </MutliStageRenderer>
        <div />
      </MultiStageStoreProvider>
    </CourseStoreProvider>
  )
}
