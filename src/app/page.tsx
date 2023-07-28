'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dollarIcon from '@/assets/icon/dollar.svg'

export default function Home() {
  const router = useRouter()
  const redirect = () => {
    router.push(`/actions/hhey?name=$repayy`)
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div>
        <img src={dollarIcon.src} alt="" />
        <nav className='flex'>
          <Link href={'/about'}>Aboout</Link>
          <div className='ml-2'></div>
          <Link href={`/actions/ñcñcñcñc?name=deposiit`}>
            Action
          </Link>
          <button onClick={redirect} className='ml-2'>repay</button>
        </nav>
     </div>
    </main>
  )
}
