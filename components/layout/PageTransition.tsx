'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Keep this a passthrough — wrapping children in <AnimatePresence mode="wait"> here
// breaks the music player's shared-element morph (inline ↔ floating uses layoutId).
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = ''
    // Disable browser scroll restoration so back/forward and reloads can't
    // resurrect a previous offset. Pages should always start at top.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    // Skip when an in-page anchor is targeted — let the browser scroll there.
    if (window.location.hash) {
      globalThis.lenis?.start()
      return
    }

    if (globalThis.lenis) {
      globalThis.lenis.scrollTo(0, { immediate: true })
      globalThis.lenis.start()
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [pathname])

  return <>{children}</>
}
