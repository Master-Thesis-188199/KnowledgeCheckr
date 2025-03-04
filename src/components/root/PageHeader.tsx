import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import getTheme from '@/lib/Shared/getTheme'

export default async function PageHeader() {
  const theme = await getTheme()

  return (
    <div className='flex items-center justify-between bg-white px-6 py-3 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-neutral-600'>
      <span className='text-xl font-semibold'>KnowledgeCheckr</span>
      <div className='flex items-center gap-2'>
        <ThemeSwitcher defaultValue={theme} />
      </div>
    </div>
  )
}
