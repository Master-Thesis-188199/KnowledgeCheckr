import { notFound, redirect, RedirectType } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeNavigationNextButton, PracticeNavigationPreviousButton } from '@/src/components/checks/[share_token]/practice/NavigationButtons'
import { PracticeBreadcrumbs } from '@/src/components/checks/[share_token]/practice/PracticeBreadcrumbs'
import { PracticeProgress } from '@/src/components/checks/[share_token]/practice/PracticeProgress'
import { PracticeQuestionNavigation } from '@/src/components/checks/[share_token]/practice/PracticeQuestionNavigation'
import { PracticeStoreProvider } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { RenderPracticeQuestion } from '@/src/components/checks/[share_token]/practice/RenderPracticeQuestion'
import PageHeading from '@/src/components/Shared/PageHeading'
import _logger from '@/src/lib/log/Logger'
import { cn } from '@/src/lib/Shared/utils'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export default async function PracticePage({ params, searchParams }: { params: Promise<{ share_token: string }>; searchParams?: Promise<{ category?: '_none_' | string }> }) {
  const { share_token } = await params
  const { category } = (await searchParams) ?? {}

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  if (!check.settings.practice.enablePracticing) redirect(`/checks/${share_token}/practice/not-allowed`, RedirectType.replace)

  const unfilteredQuestions = check.questions.filter((q) => q.accessibility === 'all' || q.accessibility === 'practice-only')
  const categories = Array.from(new Set(unfilteredQuestions.map((q) => q.category)))

  // When there are no categories to switch between -> set (practice-) questions to be the base-questions.
  let practiceQuestions = categories.length > 1 ? [] : unfilteredQuestions

  // category already selected
  if (category) {
    const categoryName = decodeURIComponent(category)

    if (categoryName === '_none_') {
      logger.debug('Pre-setting practice questions to be unfiltered.')
      practiceQuestions = unfilteredQuestions
    } else {
      logger.debug(`Pre-setting practice questions to use '${categoryName}' category.`)
      practiceQuestions = unfilteredQuestions.filter((q) => q.category.toLowerCase().trim() === categoryName.toLowerCase().trim())
    }
  }

  return (
    <PracticeStoreProvider initialStoreProps={{ questions: unfilteredQuestions, practiceQuestions, checkId: check.id }} key={category}>
      <PracticeBreadcrumbs className={cn('mb-2', categories.length === 1 && 'hidden')} share_token={share_token} categories={categories} selectedCategory={category} />

      <PageHeading title='Practice' />

      <div className='mx-auto w-full max-w-3/4 lg:max-w-1/2'>
        <PracticeQuestionNavigation />

        <PracticeProgress />

        <RenderPracticeQuestion />

        <div className={cn('flex justify-between', practiceQuestions.length <= 1 && 'hidden')}>
          <PracticeNavigationPreviousButton />
          <PracticeNavigationNextButton />
        </div>
      </div>
    </PracticeStoreProvider>
  )
}
