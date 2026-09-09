'use client'

import { Suspense, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work } from '@/content/works'
import { lazyBodies } from '@/content/works/bodies'
import { cn } from '@/lib/utils'
import { lockScroll } from '@/lib/scrollLock'

const aspectClass: Record<NonNullable<Work['media']>['aspect'] & string, string> = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '9/16': 'aspect-[9/16]',
  '21/9': 'aspect-[21/9]',
}

/**
 * Compact, centered modal for non-case-study works:
 *  - image  → full-frame image
 *  - video  → embedded player
 *  - component → lazy-loaded interactive demo
 *
 * For case-study works, use `WorkSheet` instead.
 */
export function WorkModal({
  work,
  onClose,
}: {
  work: Work | null
  onClose: () => void
}) {
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

  const Body = work && work.type === 'component' ? lazyBodies[work.slug] ?? null : null
  const mediaAspect =
    work && (work.type === 'image' || work.type === 'video')
      ? aspectClass[work.media?.aspect ?? '16/9']
      : null

  // Portal to <body> so the overlay escapes any ancestor stacking/transform
  // context and always paints above global chrome (e.g. the fixed sidebar).
  // Only overlays after a client click, so no SSR content to reconcile.
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pr-[calc(1rem+var(--sb,0px))] md:p-8 md:pr-[calc(2rem+var(--sb,0px))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative max-h-[92vh] w-full overflow-hidden rounded-2xl border border-white/25 bg-background shadow-2xl',
              work.type === 'image' && 'max-w-5xl',
              work.type === 'video' && 'max-w-4xl',
              work.type === 'component' && 'max-w-2xl',
              mediaAspect,
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:bg-background hover:text-foreground"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {work.type === 'image' && work.media && (
              <Image
                src={work.media.src}
                alt={work.name}
                fill
                sizes="100vw"
                className="object-contain"
              />
            )}

            {work.type === 'video' && work.media && (
              <video
                src={work.media.src}
                poster={work.media.poster}
                controls
                autoPlay
                playsInline
                className="absolute inset-0 size-full bg-black object-contain"
              />
            )}

            {work.type === 'component' && (
              <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 md:p-8">
                {Body && (
                  <Suspense fallback={null}>
                    <Body />
                  </Suspense>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
