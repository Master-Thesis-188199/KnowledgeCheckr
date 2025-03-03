export default async function PageHeader() {
  return (
    <div className='flex items-center justify-between bg-gray-300/80 px-6 py-3 text-neutral-600 dark:text-neutral-200 dark:bg-neutral-900 dark:shadow-neutral-600'>
      <span className='text-xl font-semibold'>KnowledgeCheckr</span>
      <div className='flex items-center gap-2'>
        <span className='rounded-full bg-gray-500 size-6 dark:bg-gray-600' />
        <span className='text-lg'>Profile</span>
        <span className='ml-2 rounded-md bg-gray-400 px-3 py-1'>Theme</span>
      </div>
    </div>
  )
}
