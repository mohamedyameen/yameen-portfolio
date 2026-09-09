'use client'

import { useEffect, useRef } from 'react'

/**
 * Floating page scrollbar. The native root scrollbar is hidden in globals.css
 * (so it never takes layout space and modals can lock scroll without the page
 * reflowing); this draws a small overlay thumb instead.
 *
 * Behaviour:
 *  - fades in only while the page scrolls, fades out after a moment of rest
 *  - while visible it's grabbable: drag the thumb, or click the track to jump;
 *    hovering it keeps it from fading
 *  - inert while a modal locks page scroll (body overflow: hidden), and its
 *    hit area only accepts pointer events while visible, so it never blocks
 *    clicks on content underneath
 */
export default function ScrollbarOverlay() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return

    let hideTimer: ReturnType<typeof setTimeout> | undefined
    let raf = 0
    let dragging = false
    let hovering = false
    let dragStartY = 0
    let dragStartScroll = 0

    const locked = () => document.body.style.overflow === 'hidden'

    const metrics = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const trackH = track.clientHeight
      const thumbH = Math.max(40, (doc.clientHeight / doc.scrollHeight) * trackH)
      return { scrollable, trackH, thumbH }
    }

    const update = () => {
      const { scrollable, trackH, thumbH } = metrics()
      if (scrollable <= 0) return false
      const y = (window.scrollY / scrollable) * (trackH - thumbH)
      thumb.style.height = `${thumbH}px`
      thumb.style.transform = `translateY(${y}px)`
      return true
    }

    const show = () => {
      clearTimeout(hideTimer)
      track.style.opacity = '1'
      track.style.pointerEvents = 'auto'
    }
    const hide = () => {
      track.style.opacity = '0'
      track.style.pointerEvents = 'none'
    }
    const scheduleHide = () => {
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        if (!dragging && !hovering) hide()
      }, 900)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!update()) return
        show()
        scheduleHide()
      })
    }

    // Hovering the (visible) track pins it; it fades once the cursor leaves.
    // While hidden the track is inert, so these can't resurrect it — only a
    // scroll brings it back.
    const onEnter = () => {
      hovering = true
      clearTimeout(hideTimer)
    }
    const onLeave = () => {
      hovering = false
      if (!dragging) scheduleHide()
    }

    const setScroll = (pos: number) => {
      const lenis = globalThis.lenis
      if (lenis) lenis.scrollTo(pos, { immediate: true })
      else window.scrollTo(0, pos)
    }

    const onPointerDown = (e: PointerEvent) => {
      const { scrollable, trackH, thumbH } = metrics()
      if (scrollable <= 0 || locked()) return
      e.preventDefault()
      let startScroll = window.scrollY
      if (!thumb.contains(e.target as Node)) {
        // Track click: jump so the thumb centers on the pointer, then allow
        // dragging to continue from there.
        const trackTop = track.getBoundingClientRect().top
        const target = Math.min(Math.max(e.clientY - trackTop - thumbH / 2, 0), trackH - thumbH)
        startScroll = (target / (trackH - thumbH)) * scrollable
        setScroll(startScroll)
      }
      dragging = true
      dragStartY = e.clientY
      dragStartScroll = startScroll
      track.setPointerCapture(e.pointerId)
      track.dataset.dragging = ''
      show()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const { scrollable, trackH, thumbH } = metrics()
      if (scrollable <= 0) return
      const delta = ((e.clientY - dragStartY) / (trackH - thumbH)) * scrollable
      setScroll(Math.min(Math.max(dragStartScroll + delta, 0), scrollable))
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      delete track.dataset.dragging
      track.releasePointerCapture(e.pointerId)
      scheduleHide()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    track.addEventListener('pointerenter', onEnter)
    track.addEventListener('pointerleave', onLeave)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerUp)
    track.addEventListener('pointercancel', onPointerUp)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      track.removeEventListener('pointerenter', onEnter)
      track.removeEventListener('pointerleave', onLeave)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerUp)
      track.removeEventListener('pointercancel', onPointerUp)
      clearTimeout(hideTimer)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={trackRef}
      aria-hidden
      className="group fixed inset-y-2 right-0 z-[60] w-3 cursor-default opacity-0 transition-opacity duration-300 [touch-action:none]"
      style={{ pointerEvents: 'none' }}
    >
      <div
        ref={thumbRef}
        className="absolute right-1 w-1 rounded-full bg-foreground/30 transition-[width,background-color] duration-200 group-hover:w-1.5 group-hover:bg-foreground/45 group-data-dragging:w-1.5 group-data-dragging:bg-foreground/60"
      />
    </div>
  )
}
