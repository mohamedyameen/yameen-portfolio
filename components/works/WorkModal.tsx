'use client'

import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work } from '@/content/works'
import { bodyLoaders } from '@/content/works/bodies'
import { cn } from '@/lib/utils'

const lazyBodies: Record<string, ComponentType> = Object.fromEntries(
  Object.entries(bodyLoaders).map(([slug, loader]) => [
    slug,
    lazy(loader) as unknown as ComponentType,
  ]),
)

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
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    globalThis.lenis?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      globalThis.lenis?.start()
    }
  }, [work, onClose])

  const Body = work && work.type === 'component' ? lazyBodies[work.slug] ?? null : null
  const mediaAspect =
    work && (work.type === 'image' || work.type === 'video')
      ? aspectClass[work.media?.aspect ?? '16/9']
      : null

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            layoutId={`work-card-${work.slug}`}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'relative max-h-[92vh] w-full overflow-hidden rounded-2xl border border-border bg-background shadow-2xl',
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={work.media.src}
                alt={work.name}
                className="absolute inset-0 size-full object-contain"
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
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <header className="flex flex-col gap-1">
                  <h2 className="text-sm font-semibold text-foreground md:text-base">
                    {work.name}
                  </h2>
                  {work.summary && (
                    <p className="max-w-[60ch] text-xs text-muted-foreground md:text-sm">
                      {work.summary}
                    </p>
                  )}
                </header>
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
    </AnimatePresence>
  )
}
