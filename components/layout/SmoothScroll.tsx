'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

declare global {
  // eslint-disable-next-line no-var
  var lenis: InstanceType<typeof Lenis> | undefined
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
