'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

declare global {
  interface Window {
    lenis?: Lenis
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1.5,
      touchMultiplier: 2,
      smoothWheel: true,
      syncTouch: false,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    })
    window.lenis = lenis

    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.lenis = undefined
    }
  }, [])

  return null
}
