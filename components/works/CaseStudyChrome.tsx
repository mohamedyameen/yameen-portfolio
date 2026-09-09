'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Work } from '@/content/works'

/* ────────────────────────────────────────────────────────────────────── */
/*  Title block — the big serif title + a supporting line of subtext,     */
/*  rendered at the very top of the sheet (above the hero). Replaces the   */
/*  old "Overview" section: the title leads, the summary sits beneath it.  */
/*                                                                        */
/*  On open the title fades + rises in as the sheet settles, the subtext   */
/*  just after — a dedicated entrance (not the scroll observer). The        */
/*  cs-title-block marker keeps the wrapper out of WorkSheet's cascade.     */
/* ────────────────────────────────────────────────────────────────────── */

export function CaseStudyTitle({ work }: { work: Work }) {
  const title = work.tagline ?? work.summary ?? work.name
  const subtext = work.summary && work.summary !== title ? work.summary : null
  const reduce = useReducedMotion()

  // Entrance tied to the sheet opening: the title fades + rises in as the
  // bottom sheet settles, the subtext a beat later. Plays once on mount, so
  // it re-runs every time the sheet is opened.
  const rise = reduce
    ? {}
    : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

  return (
    <div className="cs-title-block flex flex-col gap-4 sm:gap-5">
      <motion.h1
        {...rise}
        transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl text-[26px] sm:text-[34px] md:text-[42px] leading-[1.1] tracking-tight text-foreground"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {title}
      </motion.h1>
      {subtext ? (
        <motion.p
          {...rise}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-sm leading-relaxed text-foreground/70 sm:text-base"
        >
          {subtext}
        </motion.p>
      ) : null}
    </div>
  )
}
/* ────────────────────────────────────────────────────────────────────── */
/*  Meta strip — Role / Contribution / Timeline / … in mono labels,       */
/*  rendered below the hero, framed with a divider above and below.       */
/* ────────────────────────────────────────────────────────────────────── */

export function CaseStudyMeta({ work }: { work: Work }) {
  const meta = [
    { label: 'Role', value: work.role },
    { label: 'Contribution', value: work.contribution },
    { label: 'Timeline', value: work.time ?? work.year },
    { label: 'Client', value: work.client },
    { label: 'Disciplines', value: work.disciplines?.join(' · ') },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value))

  if (meta.length === 0) return null

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-border py-6 sm:grid-cols-4 sm:gap-x-10 lg:mb-20 lg:gap-x-14">
      {meta.map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-2">
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
            {label}
          </dt>
          <dd className="max-w-[26ch] text-[13px] leading-snug text-foreground/80 sm:text-sm">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Table of Contents (scroll-spy)                                       */
/*                                                                       */
/*  Scans the given scroll container for elements with [data-toc-label]  */
/*  on mount and whenever the body changes. Uses IntersectionObserver to */
/*  highlight the section closest to the top of the viewport.            */
/* ────────────────────────────────────────────────────────────────────── */

type TocItem = { id: string; label: string }

export function CaseStudyTOC({
  scrollRef,
  bodyKey,
}: {
  scrollRef: React.RefObject<HTMLElement | null>
  /** Changes when the work slug changes, forcing a re-scan. */
  bodyKey: string
}) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  // 0..1 — overall scroll progress through the case study.
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    let raf = 0
    let cancelled = false

    const scan = () => {
      const found: TocItem[] = []
      const seenIds = new Set<string>()
      root.querySelectorAll<HTMLElement>('[data-toc-label]').forEach((el, i) => {
        const label = el.dataset.tocLabel?.trim()
        if (!label) return
        let id = el.id
        if (!id) {
          id = `toc-${i}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          el.id = id
        }
        if (seenIds.has(id)) return
        seenIds.add(id)
        found.push({ id, label })
      })
      if (found.length === 0) return false
      setItems(found)
      setActiveId((prev) => prev ?? found[0].id)
      return true
    }

    // The case-study body is lazy-loaded (Suspense), so it may not be in the
    // DOM on the first frame. Scan once; if the sections aren't there yet,
    // watch the subtree and re-scan until they mount, then stop.
    const observer = new MutationObserver(() => {
      if (cancelled) return
      if (scan()) observer.disconnect()
    })

    raf = requestAnimationFrame(() => {
      if (cancelled) return
      if (!scan()) observer.observe(root, { childList: true, subtree: true })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [scrollRef, bodyKey])

  // Track overall scroll progress so the vertical rail can fill in real time.
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const update = () => {
      const max = root.scrollHeight - root.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0
      setProgress(p)
    }
    update()

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }
    root.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(rafRef.current)
      root.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [scrollRef, bodyKey])

  useEffect(() => {
    const root = scrollRef.current
    if (!root || items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer entries that are near the top of the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        root,
        // Tightened top boundary so the active item flips when the section
        // crosses the upper third of the viewport rather than the middle.
        rootMargin: '-15% 0px -55% 0px',
        threshold: [0, 0.1, 0.5, 1],
      },
    )

    items.forEach(({ id }) => {
      const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items, scrollRef])

  const handleJump = (id: string) => {
    const root = scrollRef.current
    if (!root) return
    const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (!el) return
    const top = el.offsetTop - 16
    root.scrollTo({ top, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  // Index of the active section — anything before it is "read", after it
  // is "upcoming". Used to tier the brightness of each row.
  const activeIndex = Math.max(0, items.findIndex((it) => it.id === activeId))

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-auto relative hidden flex-col gap-2 pl-4 text-[12px] xl:flex"
    >
      {/* Vertical rail — dim base line for the full TOC height. */}
      <span
        aria-hidden
        className="absolute left-0 top-1 bottom-1 w-px bg-foreground/15"
      />
      {/* Progress fill — gradient that fades out at its leading edge so the
          line eases into the unfilled portion instead of ending in a hard
          cut. Height tracks overall scroll position. */}
      <span
        aria-hidden
        className="absolute left-0 top-1 w-px transition-[height] duration-200 ease-out"
        style={{
          height: `calc((100% - 8px) * ${progress})`,
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.15) 100%)',
        }}
      />

      {items.map(({ id, label }, i) => {
        const isActive = id === activeId
        const isRead = i < activeIndex
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleJump(id)}
            className={cn(
              'group flex items-center text-left transition-all duration-200',
              isActive
                ? 'translate-x-1 text-foreground'
                : isRead
                  ? 'text-foreground/65 hover:translate-x-0.5 hover:text-foreground/85'
                  : 'text-foreground/35 hover:translate-x-0.5 hover:text-foreground/65',
            )}
          >
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  ScrollProgress — tiny tick marks on the right showing progress       */
/* ────────────────────────────────────────────────────────────────────── */

export function CaseStudyScrollProgress({
  scrollRef,
  ticks = 16,
}: {
  scrollRef: React.RefObject<HTMLElement | null>
  ticks?: number
}) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0
      setProgress(p)
    }
    update()

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(rafRef.current)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [scrollRef])

  const activeIndex = Math.round(progress * (ticks - 1))

  return (
    <div
      aria-hidden
      className="pointer-events-none hidden flex-col items-end gap-1.5 xl:flex"
    >
      {Array.from({ length: ticks }).map((_, i) => {
        const active = i <= activeIndex
        return (
          <span
            key={i}
            className={cn(
              'h-px transition-all duration-200',
              active ? 'w-4 bg-foreground/80' : 'w-2 bg-foreground/20',
            )}
          />
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  ScrollTop — floating control pinned bottom-right of the sheet.        */
/*                                                                        */
/*  A circular button wrapped in a progress ring that tracks how far the  */
/*  reader is through the case study. Fades in once scrolled past the     */
/*  hero; clicking eases the scroll container back to the top.            */
/* ────────────────────────────────────────────────────────────────────── */

export function CaseStudyScrollTop({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLElement | null>
}) {
  const [progress, setProgress] = useState(0)
  const [show, setShow] = useState(false)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const update = () => {
      const max = el.scrollHeight - el.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0
      setProgress(p)
      setShow(el.scrollTop > 360)
    }
    update()

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(rafRef.current)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [scrollRef])

  // Progress ring geometry (r = 17 → circumference ≈ 106.8).
  const C = 2 * Math.PI * 17

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'absolute bottom-4 right-4 z-20 inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground/80 shadow-lg backdrop-blur transition-all duration-300 hover:text-foreground sm:bottom-6 sm:right-6',
        show
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      )}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground/50"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  )
}
