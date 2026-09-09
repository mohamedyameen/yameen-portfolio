import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * A labeled placeholder that reserves the spot where a real screenshot,
 * video, or interactive demo will go. Renders a dimmed cinematic backdrop
 * behind a dashed frame and a caption describing the shot, so the case study
 * reads as a finished, intentional layout before any proprietary imagery is
 * dropped in.
 *
 * Swapping in the real media is a one-line edit: replace <ShotPlaceholder …/>
 * with <SceneShot … /> or <Img … /> at the same spot.
 *
 * Marked `__wide` (like body's Img/Video and SceneShot) so it spans the media
 * column when dropped directly into a labeled <Section>.
 */

type PlaceholderAspect = '16/9' | '4/3' | '3/2' | '16/10' | '1/1' | '3/4'

const aspectClass: Record<PlaceholderAspect, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '16/10': 'aspect-[16/10]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
}

export function ShotPlaceholder({
  label,
  aspect = '16/10',
  bg = '/works/facilio-helpdesk-ai/hero.jpg',
}: {
  /** What goes here — describes the shot so the layout reads at a glance. */
  label: string
  aspect?: PlaceholderAspect
  /** Backdrop image dimmed behind the placeholder frame. */
  bg?: string
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        className={cn(
          'relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/25',
          aspectClass[aspect],
        )}
      >
        {/* Cinematic backdrop, dimmed so the frame still reads as a placeholder. */}
        <Image
          src={bg}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        {/* faint grid wash so the empty frame still reads as a "surface" */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative flex max-w-[80%] flex-col items-center gap-2 text-center">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/20 backdrop-blur-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="1.6" />
              <path d="m21 15-4.5-4.5L5 21" />
            </svg>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/70">
            Screen to add
          </span>
          <span className="text-[12px] leading-5 text-white/65 sm:text-[13px]">
            {label}
          </span>
        </div>
      </div>
    </figure>
  )
}

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(ShotPlaceholder as unknown as { __wide?: boolean }).__wide = true
