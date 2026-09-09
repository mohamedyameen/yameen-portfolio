// Single source of truth for cross-route programmatic scrolls.
//
// Why this exists: PageTransition runs a scroll-reset on every pathname
// change, and Sidebar wants the home page's '#works' section to smooth-
// scroll into view after a cross-route nav. Without a shared intent, they
// race — PageTransition's instant reset fights Sidebar's smooth scroll on
// desktop (mobile bypasses Lenis entirely so the bug never surfaces there).
//
// Sidebar sets the intent before router.push; PageTransition consumes it on
// the next effect run and owns the scroll. There's exactly one writer to
// window.scrollY per route transition.

export type ScrollIntent = 'works' | 'top' | null

let pending: ScrollIntent = null

export function setScrollIntent(intent: ScrollIntent) {
  pending = intent
}

export function consumeScrollIntent(): ScrollIntent {
  const v = pending
  pending = null
  return v
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export function smoothScrollToWorks(onDone?: () => void) {
  const target = document.getElementById('works')
  if (!target) { console.log('[scroll] works element NOT FOUND'); onDone?.(); return }
  const offset = window.innerWidth < 1024 ? -56 : 0
  const lenis = globalThis.lenis
  const rectTop = target.getBoundingClientRect().top
  const docTop = rectTop + window.scrollY
  console.log('[scroll] toWorks', { lenis: !!lenis, rectTop, docTop, scrollY: window.scrollY, lenisStopped: lenis?.isStopped })
  if (lenis) {
    // force: true defeats Lenis's stopped state if a modal/sheet didn't
    // cleanly resume it.
    lenis.start()
    lenis.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: easeOutCubic,
      force: true,
      onComplete: () => { console.log('[scroll] toWorks DONE', window.scrollY); onDone?.() },
    })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => onDone?.(), 800)
  }
}

export function smoothScrollToTop(onDone?: () => void) {
  const lenis = globalThis.lenis
  console.log('[scroll] toTop', { lenis: !!lenis, scrollY: window.scrollY, lenisStopped: lenis?.isStopped })
  if (lenis) {
    lenis.start()
    lenis.scrollTo(0, { duration: 1.2, easing: easeOutCubic, force: true, onComplete: () => onDone?.() })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => onDone?.(), 800)
  }
}
