'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Defensive cleanup on every route change. If a modal, sheet, or drawer
  // was open when the user navigated away, its cleanup may not have run in
  // time — leaving body overflow locked, Lenis paused, or the page scrolled
  // mid-way. Any of those make the new page look blank until reload.
  useEffect(() => {
    document.body.style.overflow = ''
    globalThis.lenis?.start()
    globalThis.lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
