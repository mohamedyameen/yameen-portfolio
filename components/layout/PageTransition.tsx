'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = ''
    globalThis.lenis?.start()
  }, [pathname])

  return <>{children}</>
}
