export default async function RootLoadingPage() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-3'>
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-neutral-600 border-t-transparent dark:border-neutral-400 dark:border-t-transparent'></div>
      <h2 className='pl-2 text-neutral-600 dark:text-neutral-300'>Loading...</h2>
    </div>
  )
}
