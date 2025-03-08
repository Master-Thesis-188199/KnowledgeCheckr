import { getServerSession, User } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { twMerge } from 'tailwind-merge'
import SidebarBannerContent from '@/components/root/Navigation/user/SidebarBannerContent'
import { DynamicIcon } from 'lucide-react/dynamic'
import Link, { LinkProps } from 'next/link'
import Image from 'next/image'

export default async function SidebarUserBanner() {
  const session = await getServerSession(options)

  if (!session) return LoginBanner()

  return (
    <Banner user={session.user} href={'api/auth/signout'}>
      {session.user?.name}
    </Banner>
  )
}

function LoginBanner() {
  return (
    <Banner href='/api/auth/signin' user={undefined}>
      <span>Please Sign In</span>
    </Banner>
  )
}

function Banner({ children, user, className, ...props }: { children: React.ReactNode; className?: string; user: Partial<User> | undefined } & LinkProps) {
  return (
    <Link
      {...props}
      className={twMerge('group/sidebar flex items-center justify-start gap-4 rounded-md py-2 hover:cursor-pointer hover:bg-neutral-200/75 hover:font-semibold dark:hover:bg-neutral-700', className)}>
      <BannerIcon user={user} />
      <SidebarBannerContent>{children}</SidebarBannerContent>
    </Link>
  )
}

function BannerIcon({ user }: { user: Partial<User> | undefined }) {
  if (!user || !user.image) return <DynamicIcon name='user-round' className='ml-[9px] size-6 shrink-0' />

  return <Image src={user.image} alt='User Profile' width={24} height={24} className='ml-[9px] rounded-full' />
}
