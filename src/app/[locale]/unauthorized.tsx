import Link from 'next/link'

export default async function Unauthorized() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='flex items-center gap-4'>
        <div className='flex h-12 items-center justify-center border-r-[0.5px] border-black pr-4 text-xl font-semibold dark:border-gray-500'>401</div>
        <h1>You&apos;re not authorized to access this page.</h1>
      </div>
      <Link
        className='mt-8 rounded-md bg-neutral-100 px-3 py-1.5 shadow-sm ring-1 shadow-neutral-300 ring-ring hover:bg-neutral-200 hover:ring-ring-hover dark:bg-neutral-800 dark:shadow-neutral-600 dark:ring-ring-subtle dark:hover:bg-neutral-700 dark:hover:ring-ring'
        href={'/account/login?type=signin'}>
        Login
      </Link>
    </div>
  )
}
