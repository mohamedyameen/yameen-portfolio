'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Lightweight defensive cleanup on every route change — clears any stuck
  // body overflow (from a modal/sheet/drawer that didn't tear down cleanly)
  // and re-starts Lenis. Doesn't touch scroll position, so no visible lag.
  useEffect(() => {
    document.body.style.overflow = ''
    globalThis.lenis?.start()
  }, [pathname])

  return (
    <AnimatePresence mode="wait" initial={false}>
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
