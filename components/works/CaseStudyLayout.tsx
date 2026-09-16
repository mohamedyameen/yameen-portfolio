'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import type { Work } from '@/content/works'
import { WorkHero } from '@/components/works/WorkHero'
import {
  CaseStudyTitle,
  CaseStudyMeta,
  CaseStudyScrollTop,
} from '@/components/works/CaseStudyChrome'

/**
 * The reading frame for `/works/[slug]` — title, hero, meta strip, then the
 * case-study body. This is the structure that used to live in the bottom
 * sheet; it now sits on the route itself, scrolling the document.
 *
 * Client-side because the scroll-linked reveal and the back-to-top control
 * need refs and effects. The body stays a server component: the route passes
 * it in as `children`.
 */
export function CaseStudyLayout({
  work,
  children,
}: {
  work: Work
  children?: React.ReactNode
}) {
  const revealRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  // Escape leaves the case study, the way it used to close the sheet. The
  // page has no backdrop to click, so this and the back link are the only
  // ways out that aren't the browser's own chrome.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [router])

  // Scroll-linked reveal: the hero, meta, and each body section are driven
  // continuously by their scroll position rather than a one-shot trigger. A
  // section that's still below the fold sits at a low opacity + slight scale
  // (barely visible, so you know it's coming) and ramps to full opacity and
  // full scale as it scrolls up into view. The title block is skipped — it
  // runs its own entrance on mount.
  useEffect(() => {
    const root = revealRef.current
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
      const vh = window.innerHeight
      // Progress runs 0 → 1 as a section's top rises from ~the bottom of the
      // viewport up to ~55% of it.
      const start = vh * 0.96
      const end = vh * 0.55
      // We write scale/translate back onto the children, so reading each
      // child's own rect would feed the reveal its own output and oscillate.
      // The wrapper is never transformed and is `relative`, so its rect plus
      // each child's layout-based offsetTop gives an undisturbed viewport
      // position.
      const wrapperTop = root.getBoundingClientRect().top
      for (const el of els) {
        const top = wrapperTop + el.offsetTop
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
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    // Media and fonts settling change section offsets after the first paint.
    const mo = new MutationObserver(() => {
      register()
      update()
    })
    mo.observe(root, { childList: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      mo.disconnect()
    }
  }, [work.slug])

  return (
    <>
      {/* Sticky back affordance — the page equivalent of the sheet's close
          button. Sits above the title so it scrolls with the read but stays
          reachable at the top edge. */}
      <div className="sticky top-0 z-30 -mx-5 mb-2 bg-background/80 px-5 py-6 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-5 lg:px-5">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back to work
        </Link>
      </div>

      <div
        ref={revealRef}
        className="cs-body relative flex flex-col gap-8 sm:gap-10 md:gap-12"
      >
        <CaseStudyTitle work={work} />

        {/* shrink-0: the hero's height comes from aspect-ratio with only
            absolutely-positioned children, so a constrained flex column
            would otherwise collapse it to zero height. */}
        <div className="shrink-0">
          <WorkHero work={work} />
        </div>

        <CaseStudyMeta work={work} />

        {children}

        {/* Tail spacer — gives the final section enough scroll room to travel
            up into the full-reveal zone instead of resting dim at the bottom.
            Skipped by the scroll-reveal in register(). */}
        <div aria-hidden className="cs-tail-spacer h-[18vh] shrink-0" />
      </div>

      <CaseStudyScrollTop />
    </>
  )
}
