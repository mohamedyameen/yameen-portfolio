'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from '@/components/works/SceneShot'

/**
 * The "design → build" pairing for the case study: a Figma canvas and the
 * Cursor/Claude editor shown as two overlapping floating windows over a dark
 * backdrop — the design tool behind, the code editor in front, so the section's
 * "rough layout in Figma → build the real thing in code" line reads as one image.
 *
 * Each window is click-to-expand into the shared image lightbox.
 *
 * Marked `__wide` (like body's Img / SceneShot) so it spans the media column
 * when dropped directly into a labeled <Section>.
 */

const FIGMA = '/works/facilio-helpdesk-ai/figma.png'
const CURSOR = '/works/facilio-helpdesk-ai/cursor.png'

export function DesignBuildShowcase() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <figure className="flex flex-col gap-2">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-border">
        {/* Cinematic backdrop (the project's hero image), blurred into a soft
            colour wash so the windows stay the focus — no dark tint. */}
        <Image
          src="/works/facilio-helpdesk-ai/hero.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="scale-105 object-cover blur-[2px]"
        />

        {/* Back window — Figma (design) */}
        <Window
          src={FIGMA}
          alt="The Helpdesk design file in Figma — frames for onboarding, intake, scope of work, scenarios and more"
          className="left-[2%] top-[6%] w-[62%] rotate-[-2.5deg] z-10"
          onOpen={() => setOpen(FIGMA)}
        />

        {/* Front window — Cursor / Claude (build) */}
        <Window
          src={CURSOR}
          alt="Building the Helpdesk frontend in Cursor with Claude — the ticket workload card and the merged-tickets context"
          className="left-[36%] top-[27%] w-[62%] rotate-[2.5deg] z-20"
          onOpen={() => setOpen(CURSOR)}
        />
      </div>

      <figcaption className="text-[11px] sm:text-xs text-muted-foreground">
        The loop, in one frame — I lay out the structure and hierarchy in Figma
        (behind), then build the real thing in code in Cursor with Claude doing
        most of the typing (front), while I keep the design calls.
      </figcaption>

      {open && (
        <Lightbox src={open} alt="Design and build" onClose={() => setOpen(null)} />
      )}
    </figure>
  )
}

function Window({
  src,
  alt,
  className,
  onOpen,
}: {
  src: string
  alt: string
  className: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open full screen: ${alt}`}
      className={`group absolute cursor-zoom-in transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus-visible:outline-none ${className}`}
    >
      <div className="relative aspect-[1600/1039] w-full overflow-hidden rounded-lg bg-muted shadow-2xl shadow-black/30 ring-1 ring-black/10 dark:shadow-black/60 dark:ring-white/12 sm:rounded-xl">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 60vw, 560px"
          className="object-cover object-left-top"
        />
      </div>
      {/* Expand affordance */}
      <span className="pointer-events-none absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 3h6v6" />
          <path d="M9 21H3v-6" />
          <path d="M21 3l-7 7" />
          <path d="M3 21l7-7" />
        </svg>
      </span>
    </button>
  )
}

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(DesignBuildShowcase as unknown as { __wide?: boolean }).__wide = true
