'use client'

import { Suspense, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work } from '@/content/works'
import { lazyBodies } from '@/content/works/bodies'
import { WorkHero } from '@/components/works/WorkHero'
import { CaseStudyTitle, CaseStudyMeta, CaseStudyScrollTop } from '@/components/works/CaseStudyChrome'
import { lockScroll } from '@/lib/scrollLock'

export function WorkSheet({
  work,
  onClose,
}: {
  work: Work | null
  onClose: () => void
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!work) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const unlock = lockScroll()
    return () => {
      document.removeEventListener('keydown', onKey)
      unlock()
    }
  }, [work, onClose])

  // Scroll-linked reveal: the hero, meta, and each section are driven
  // continuously by their scroll position rather than a one-shot trigger. A
  // section that's still below the fold sits at a low opacity + slight scale
  // (barely visible, so you know it's coming) and ramps to full opacity and
  // full scale as it scrolls up into view. The title block is skipped — it
  // runs its own entrance as the sheet opens. Body is lazy (Suspense), so a
  // MutationObserver picks up sections as they mount. Standalone route
  // unaffected (no scroll container there).
  useEffect(() => {
    if (!work) return
    const root = scrollRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const MIN_OPACITY = 0.18
    const MIN_SCALE = 0.94
    const els = new Set<HTMLElement>()

    const register = () => {
      root.querySelectorAll<HTMLElement>(':scope > *').forEach((el) => {
        if (el.classList.contains('cs-title-block')) return
        if (el.classList.contains('cs-tail-spacer')) return
        if (els.has(el)) return
        els.add(el)
        el.style.willChange = 'opacity, transform'
        el.style.transformOrigin = 'center top'
      })
    }

    const update = () => {
      const vh = root.clientHeight
      // Progress runs 0 → 1 as a section's top rises from ~the bottom of the
      // viewport up to ~55% of it. offsetTop is layout-based, so measuring it
      // isn't perturbed by the scale/translate we write back.
      const start = vh * 0.96
      const end = vh * 0.55
      const scrollTop = root.scrollTop
      for (const el of els) {
        const top = el.offsetTop - scrollTop
        let p = (start - top) / (start - end)
        p = p < 0 ? 0 : p > 1 ? 1 : p
        const opacity = MIN_OPACITY + (1 - MIN_OPACITY) * p
        const scale = MIN_SCALE + (1 - MIN_SCALE) * p
        const ty = (1 - p) * 14
        el.style.opacity = String(opacity)
        el.style.transform = `translateY(${ty}px) scale(${scale})`
      }
    }

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    register()
    update()
    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    const mo = new MutationObserver(() => {
      register()
      update()
    })
    mo.observe(root, { childList: true })

    return () => {
      cancelAnimationFrame(raf)
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      mo.disconnect()
    }
  }, [work])

  const Body = work ? lazyBodies[work.slug] ?? null : null

  // Portal to <body> so the overlay escapes any ancestor stacking/transform
  // context and always paints above global chrome (e.g. the fixed sidebar).
  // Only overlays after a client click, so no SSR content to reconcile.
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center pl-2 pr-[calc(0.5rem+var(--sb,0px))] sm:pl-4 sm:pr-[calc(1rem+var(--sb,0px))]">
            <motion.div
              initial={{ y: '100%' }}
              // Open: fast-then-settle (expo out). Close: a longer ease-in-out
              // so the sheet glides down smoothly instead of snapping away,
              // finishing in step with the backdrop fade.
              animate={{ y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ y: '100%', transition: { duration: 0.62, ease: [0.4, 0, 0.2, 1] } }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[96vh] w-full max-w-[90rem] flex-col overflow-hidden rounded-t-2xl border border-b-0 border-white/25 bg-background shadow-2xl"
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border-2 border-foreground/30 bg-background/80 text-foreground shadow-md backdrop-blur-md transition-colors hover:border-foreground/50 hover:bg-secondary/80 sm:right-6 sm:top-6 sm:size-12 md:right-10 md:top-10"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              <motion.div
                ref={scrollRef}
                className="cs-body flex flex-1 flex-col gap-8 sm:gap-10 md:gap-12 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-10"
                data-lenis-prevent
                // Fade the content out fast on close so the sheet glides down
                // clean instead of the busy body sliding away with it.
                exit={{ opacity: 0, transition: { duration: 0.28, ease: 'easeIn' } }}
              >
                <CaseStudyTitle work={work} />

                {/* shrink-0: the hero's height comes from aspect-ratio with
                    only absolutely-positioned children, so a constrained flex
                    column would otherwise collapse it to zero height. */}
                <div className="shrink-0">
                  <WorkHero work={work} />
                </div>

                <CaseStudyMeta work={work} />

                {Body && (
                  <Suspense fallback={null}>
                    <Body />
                  </Suspense>
                )}

                {/* Tail spacer — gives the final section enough scroll room to
                    travel up into the full-reveal zone instead of resting dim
                    at the bottom. Skipped by the scroll-reveal in register(). */}
                <div aria-hidden className="cs-tail-spacer h-[18vh] shrink-0" />
              </motion.div>

              <CaseStudyScrollTop scrollRef={scrollRef} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
