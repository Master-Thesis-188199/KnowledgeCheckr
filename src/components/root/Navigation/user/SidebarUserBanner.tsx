import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'
import Image from 'next/image'
import { SidebarElement } from '@/components/root/Navigation/RenderSideBarItems'
import { iconClasses } from '@/components/root/Navigation/SideBarConfiguration'
import { UserRound } from 'lucide-react'

export default async function SidebarUserBanner() {
  const session = await getServerSession(options)

  if (!session || !session.user) return LoginBanner()

  const UserAvatar = <Image src={session.user.image || ''} alt='User Avatar' height={24} width={24} className={iconClasses} />

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
