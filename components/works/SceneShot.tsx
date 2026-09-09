'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/**
 * A product screenshot presented as a floating browser window over the
 * Mellow cinematic sky backdrop — the sky shows around the edges, the
 * screen sits above it. Clicking it opens the full screenshot in a
 * full-screen lightbox overlay.
 *
 * Marked `__wide` (like body's Img/Video/TwoCol) so it spans both columns
 * when dropped directly into a labeled <Section>.
 */

type SceneAspect = '3/2' | '16/10' | '4/3' | '16/9' | '3/4' | '1/1'

const aspectClass: Record<SceneAspect, string> = {
  '3/2': 'aspect-[3/2]',
  '16/10': 'aspect-[16/10]',
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-[16/9]',
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
}

export function SceneShot({
  src,
  alt,
  caption,
  aspect = '3/2',
  priority = false,
  bg = '/works/mellow/bg-sky.jpg',
  focus = 'top',
  zoom = 1,
  cover = false,
  anchor = 'left',
}: {
  src: string
  alt: string
  caption?: string
  aspect?: SceneAspect
  priority?: boolean
  bg?: string
  /** When true, the screen fills the frame (object-cover) and crops to
   *  `focus` — for split/portrait frames that zoom into the important part.
   *  When false (default) the whole screen sits as a floating window. */
  cover?: boolean
  /** In cover mode, which top corner the sky peeks from; the screen bleeds
   *  off the opposite side and the bottom. */
  anchor?: 'left' | 'right'
  /** object-position / zoom anchor, e.g. 'top', 'left top', 'right top'. */
  focus?: string
  /** >1 crops in on `focus` to show that part of the screen larger. */
  zoom?: number
}) {
  const [open, setOpen] = useState(false)

  const imageStyle = {
    objectPosition: focus,
    ...(zoom !== 1 && {
      transform: `scale(${zoom})`,
      transformOrigin: focus,
    }),
  }

  return (
    <figure className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${alt || 'screenshot'} full screen`}
        className={cn(
          'group relative w-full cursor-zoom-in overflow-hidden rounded-2xl ring-1 ring-border transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          aspectClass[aspect],
        )}
      >
        {/* Cinematic backdrop */}
        <Image
          src={bg}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
          priority={priority}
        />
        {/* Gentle wash so the white window has something to sit against */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />

        {/* Floating window. In `cover` mode the window fills the frame and
            the screen crops to `focus` (zoom into the important part); the
            default keeps the whole screen visible inside a 16/10 window. */}
        {cover ? (
          <div
            className={cn(
              'absolute bottom-0 top-[7%] overflow-hidden bg-white shadow-2xl shadow-black/40 ring-1 ring-black/10',
              anchor === 'right'
                ? 'left-0 right-[6%] rounded-tr-lg sm:rounded-tr-xl'
                : 'right-0 left-[6%] rounded-tl-lg sm:rounded-tl-xl',
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 88vw, 520px"
              className="object-cover"
              style={imageStyle}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-[2%] sm:p-[3.5%]">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-white shadow-2xl shadow-black/40 ring-1 ring-black/10 sm:rounded-xl">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 88vw, 820px"
                className="object-cover"
                style={imageStyle}
              />
            </div>
          </div>
        )}

        {/* Expand affordance */}
        <span className="pointer-events-none absolute right-2.5 top-2.5 inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </span>
      </button>

      {caption && (
        <figcaption className="text-[11px] sm:text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}

      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </figure>
  )
}

export function Lightbox({
  src,
  alt,
  onClose,
}: {
  src: string
  alt: string
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
      aria-label={alt || 'Screenshot'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
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

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(SceneShot as unknown as { __wide?: boolean }).__wide = true
