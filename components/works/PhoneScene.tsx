'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Lightbox } from '@/components/works/SceneShot'
import { Iphone17Pro } from '@/components/ui/iphone-17-pro'

/**
 * Light backdrop for the phone showcases — a near-white field with a vivid
 * royal-blue streak in the top-right, so the dark iPhone frames read as the
 * hero object over an airy, on-brand blue. Driven by a static image so the look
 * stays identical to the source art regardless of the site's dark theme.
 */
export const SHOWCASE_BG = {
  backgroundImage: 'url(/works/blubees/bg-showcase.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}

/** Build a cover-fitted background style from an image URL, so a case study
 *  can swap in its own backdrop (e.g. IoT's atrium) instead of SHOWCASE_BG. */
export function bgStyle(url?: string) {
  if (!url) return SHOWCASE_BG
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }
}

/**
 * Mobile-product counterpart to SceneShot: one cinematic container where
 * multiple app screens float as iPhone mockups over a shared backdrop.
 * Clicking a phone opens that screen full-size in the lightbox.
 *
 * Marked `__wide` (like body's Img/Video/TwoCol) so it spans both columns
 * when dropped directly into a labeled <Section>.
 */

export type PhoneScreen = { src: string; alt: string }

/**
 * Backdrop layer behind the floating phones. For the default showcase field
 * (Blubees) it stays crisp and clean. For a custom photographic backdrop
 * (e.g. IoT's atrium) the image is blurred and scaled slightly and topped
 * with a gradient wash, so the busy scene recedes and the phones/cards pop.
 * Rendered absolutely; the parent clips it with `overflow-hidden`.
 */
function Backdrop({ bg }: { bg?: string }) {
  if (!bg) return <div className="absolute inset-0" style={SHOWCASE_BG} />
  return (
    <>
      <div className="absolute inset-0 scale-105 blur-[2px]" style={bgStyle(bg)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/15 to-black/20" />
    </>
  )
}

/**
 * iPhone 17 Pro mockup (Eldora UI). The screenshot rides inside the SVG,
 * clipped to the rounded screen, with the pill notch drawn on top like the
 * real device. `sizes`/`priority` are accepted for call-site compatibility but
 * unused — the SVG embeds the image directly rather than going through
 * next/image. `alt` becomes the accessible label on the frame.
 */
export function PhoneFrame({
  src,
  alt,
}: {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
}) {
  return (
    <div className="relative w-full" style={{ aspectRatio: '200 / 400' }}>
      <Iphone17Pro
        src={src}
        role="img"
        aria-label={alt || undefined}
        className="absolute inset-0 size-full text-black"
      />
    </div>
  )
}

export function PhoneScene({
  screens,
  caption,
  priority = false,
  bg,
}: {
  /** 1–3 screens, rendered left to right. */
  screens: PhoneScreen[]
  caption?: string
  priority?: boolean
  /** Optional backdrop image URL; defaults to the shared showcase field. */
  bg?: string
}) {
  const [open, setOpen] = useState<PhoneScreen | null>(null)
  const n = Math.min(screens.length, 3)

  // Phones stand upright with the whole screen visible — these are the
  // exhibits being explained, not a mood shot. Width is capped so the full
  // device height fits inside the container at both aspect ratios.
  const width = n === 1 ? 'w-[36%] sm:w-[31%]' : n === 2 ? 'w-[36%] sm:w-[29%]' : 'w-[29%] sm:w-[29%]'
  // Three phones need a tighter row to fit at the same size as one/two.
  const layout = n < 3 ? 'gap-[5%] px-[6%]' : 'gap-[3%] px-[3%]'

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="relative aspect-[4/3] sm:aspect-[16/10]">
          <Backdrop bg={bg} />
          {/* Floating phones — upright, whole screen in view */}
          <div className={cn('absolute inset-0 flex items-center justify-center', layout)}>
            {screens.slice(0, 3).map((screen, i) => (
              <button
                key={screen.src}
                type="button"
                onClick={() => setOpen(screen)}
                aria-label={`Open ${screen.alt} full screen`}
                className={cn(
                  'block shrink-0 cursor-zoom-in transition-transform duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:-translate-y-1.5',
                  width,
                )}
              >
                <PhoneFrame src={screen.src} alt={screen.alt} priority={priority && i === 0} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="text-[11px] sm:text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}

      {open && (
        <Lightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />
      )}
    </figure>
  )
}

/**
 * One screen, explained: a single phone beside a column of numbered
 * annotation cards, all sitting on the same backdrop. Use it when a screen
 * deserves a guided read rather than a group shot.
 */
export function PhoneWalkthrough({
  screen,
  notes,
  caption,
  bg,
}: {
  screen: PhoneScreen
  notes: { title: string; body: string }[]
  caption?: string
  /** Optional backdrop image URL; defaults to the shared showcase field. */
  bg?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-black/10">
        <Backdrop bg={bg} />
        {/* Phone + annotations */}
        <div className="relative z-10 flex flex-col items-center gap-6 p-5 sm:flex-row sm:gap-[6%] sm:p-[5.5%]">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open ${screen.alt} full screen`}
            className="block w-[60%] shrink-0 cursor-zoom-in transition-transform duration-300 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:-translate-y-1.5 sm:w-[34%]"
          >
            <PhoneFrame src={screen.src} alt={screen.alt} />
          </button>

          <div className="flex w-full flex-1 flex-col gap-2.5 sm:gap-3">
            {notes.map((note, i) => (
              <div
                key={note.title}
                className={cn(
                  'rounded-xl px-3.5 py-3',
                  bg
                    ? // Custom photographic backdrop (IoT): solid white card.
                      'bg-white shadow-lg shadow-black/10 ring-1 ring-black/10'
                    : // Default showcase field (Blubees): original frosted card.
                      'bg-white/70 ring-1 ring-black/[0.06] backdrop-blur-sm',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1e7bff] text-[10px] font-medium text-white">
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      'text-[12px] sm:text-[13px]',
                      bg ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-800',
                    )}
                  >
                    {note.title}
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-1.5 pl-7 text-[11px] leading-relaxed sm:text-xs',
                    bg ? 'text-neutral-600' : 'text-neutral-500',
                  )}
                >
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="text-[11px] sm:text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}

      {open && (
        <Lightbox src={screen.src} alt={screen.alt} onClose={() => setOpen(false)} />
      )}
    </figure>
  )
}

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(PhoneScene as unknown as { __wide?: boolean }).__wide = true
;(PhoneWalkthrough as unknown as { __wide?: boolean }).__wide = true
