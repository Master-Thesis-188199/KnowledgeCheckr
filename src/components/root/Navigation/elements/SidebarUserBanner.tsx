import { SidebarElement } from '@/components/root/Navigation/elements/RenderSideBarItems'
import { iconClasses } from '@/components/root/Navigation/SideBarConfiguration'
import { getServerSession } from '@/src/lib/auth/server'
import { UserRound } from 'lucide-react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
export default async function SidebarUserBanner() {
  const session = await getServerSession()

  if (!session || !session.user) return LoginBanner()

  const UserAvatar = session.user.image ? (
    <Image src={session.user.image} alt='User Avatar' height={24} width={24} className={iconClasses} />
  ) : (
    <Image src={`https://ui-avatars.com/api/?name=${encodeURI(session.user.name)}`} className={twMerge(iconClasses, 'rounded-full')} alt='User Avatar' height={24} width={24} />
  )

  return (
    <SidebarElement icon={UserAvatar} href={'api/auth/signout'}>
      {session.user?.name}
    </SidebarElement>
  )
}

function LoginBanner() {
  return (
    <SidebarElement href='/api/auth/signin' icon={<UserRound className={iconClasses} />}>
      <span>Please Sign In</span>
    </SidebarElement>
  )
}
