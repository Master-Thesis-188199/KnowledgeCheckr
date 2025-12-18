import Image from 'next/image'
import GooglePng from '@/public/GooglePng.png'
export default function GoogleIcon() {
  return <Image src={GooglePng} height={24} alt='Google icon' width={24} />
}
