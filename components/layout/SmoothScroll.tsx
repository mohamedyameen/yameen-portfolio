'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

declare global {
  var lenis: InstanceType<typeof Lenis> | undefined
}

export default function SmoothScroll() {
  useEffect(() => {
    // Skip Lenis on touch devices — iOS Safari has good native smooth scroll
    // and Lenis interferes with state restoration on route transitions there.
    const isTouchDevice =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) return

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.5,
      touchMultiplier: 2,
      smoothWheel: true,
      syncTouch: false,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    })
    globalThis.lenis = lenis

    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      globalThis.lenis = undefined
    }
  }, [])

  return null
}
