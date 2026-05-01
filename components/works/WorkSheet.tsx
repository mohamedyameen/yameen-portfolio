'use client'

import { Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { Work } from '@/content/works'
import { lazyBodies } from '@/content/works/bodies'

export function WorkSheet({
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

  const Body = work ? lazyBodies[work.slug] ?? null : null

  return (
    <AnimatePresence>
      {work && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center px-2 sm:px-4">
            <motion.div
              layoutId={`work-card-${work.slug}`}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-b-0 border-border bg-background shadow-2xl"
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

              <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
                <div className={`w-full bg-gradient-to-br ${work.accent} aspect-[16/9]`} />

                <div className="flex flex-col gap-6 p-6 md:p-10">
                  <header className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {work.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                        {work.name}
                      </h2>
                      {work.summary && (
                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                          {work.summary}
                        </p>
                      )}
                    </div>

                    <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs sm:grid-cols-4">
                      {work.client && (
                        <div className="flex flex-col gap-1">
                          <dt className="text-muted-foreground">Client</dt>
                          <dd className="text-foreground">{work.client}</dd>
                        </div>
                      )}
                      {work.role && (
                        <div className="flex flex-col gap-1">
                          <dt className="text-muted-foreground">Role</dt>
                          <dd className="text-foreground">{work.role}</dd>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <dt className="text-muted-foreground">Year</dt>
                        <dd className="text-foreground">{work.year}</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="capitalize text-foreground">{work.kind ?? 'work'}</dd>
                      </div>
                    </dl>
                  </header>

                  {Body && (
                    <Suspense fallback={null}>
                      <Body />
                    </Suspense>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
