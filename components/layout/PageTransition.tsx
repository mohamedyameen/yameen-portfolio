'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Keep this a passthrough — wrapping children in <AnimatePresence mode="wait"> here
// breaks the music player's shared-element morph (inline ↔ floating uses layoutId).
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = ''
    globalThis.lenis?.start()
  }, [pathname])

  return <>{children}</>
}
