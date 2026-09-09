'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * A muted, looping video that plays only while it's in the view area and
 * pauses (and rewinds) when it scrolls out — so off-screen clips don't burn
 * CPU/bandwidth and several videos on a page never all run at once.
 *
 * In autoplay mode the frame is also click-to-expand: clicking opens the clip
 * full screen in a lightbox overlay (Esc / backdrop / close button to dismiss),
 * mirroring the image preview. With `autoplay` false it's a plain controls
 * player and skips both the observer and the lightbox.
 */
export function VideoPlayer({
  src,
  poster,
  autoplay = true,
  loop = true,
  muted = true,
  className,
}: {
  src: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!autoplay) return
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // muted autoplay is allowed without a user gesture
          el.play().catch(() => {})
        } else {
          // stop and rewind, so coming back plays from the start
          el.pause()
          el.currentTime = 0
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [autoplay])

  if (!autoplay) {
    return (
      <video
        ref={ref}
        src={src}
        poster={poster}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        controls
        className={className}
      />
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open video full screen"
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          loop={loop}
          muted={muted}
          playsInline
          preload="metadata"
          className={className}
        />
        {/* Expand affordance, matching the image preview. */}
        <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <VideoLightbox src={src} loop={loop} muted={muted} onClose={() => setOpen(false)} />
      )}
    </>
  )
}

function VideoLightbox({
  src,
  loop,
  muted,
  onClose,
}: {
  src: string
  loop: boolean
  muted: boolean
  onClose: () => void
}) {
  useEffect(() => {
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
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video"
    >
      <video
        src={src}
        autoPlay
        loop={loop}
        muted={muted}
        controls
        playsInline
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-auto max-w-[min(100%,1400px)] rounded-xl object-contain shadow-2xl ring-1 ring-white/15"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur transition-colors hover:bg-white/20 hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}
