'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { consumeScrollIntent, smoothScrollToTop, smoothScrollToWorks } from '@/lib/scrollIntent'

// Keep this a passthrough — wrapping children in <AnimatePresence mode="wait"> here
// breaks the music player's shared-element morph (inline ↔ floating uses layoutId).
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = ''
    // Disable browser scroll restoration so back/forward and reloads can't
    // resurrect a previous offset. Pages should always start at top.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    // Sidebar may have set an intent before router.push so the cross-route
    // smooth-scroll runs here, after the new route's DOM is mounted.
    const intent = consumeScrollIntent()
    console.log('[PT] effect', { pathname, intent, hash: window.location.hash })
    if (intent === 'top') {
      smoothScrollToTop()
      return
    }
    if (intent === 'works') {
      // The #works section is part of the home page's SSR output, but if
      // anything delays it, retry briefly before giving up.
      let cancelled = false
      const tryScroll = (attempts = 0) => {
        if (cancelled) return
        if (document.getElementById('works')) {
          smoothScrollToWorks()
        } else if (attempts < 30) {
          console.log('[PT] retry, attempt', attempts)
          setTimeout(() => tryScroll(attempts + 1), 50)
        } else {
          console.log('[PT] gave up finding #works')
        }
      }
      tryScroll()
      return () => { cancelled = true }
    }

    // No programmatic intent: this is either a fresh nav (e.g. clicking a
    // case-study link) or a direct URL hit. Reset to top.
    if (globalThis.lenis) {
      globalThis.lenis.scrollTo(0, { immediate: true })
      globalThis.lenis.start()
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [pathname])

  return <>{children}</>
}
