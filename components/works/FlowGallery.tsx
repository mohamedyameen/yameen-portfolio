'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Lightbox } from '@/components/works/SceneShot'

/**
 * A grid of user-flow diagrams. Each card previews a flow (whole diagram
 * scaled down) and opens the full-resolution diagram in the lightbox — the
 * diagrams are dense, so reading them means zooming in. Marked `__wide` so it
 * spans both columns inside a labeled <Section>.
 */

export type Flow = { src: string; title: string }

export function FlowGallery({
  flows,
  caption,
}: {
  flows: Flow[]
  caption?: string
}) {
  const [open, setOpen] = useState<Flow | null>(null)

  return (
    <figure className="flex flex-col gap-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {flows.map((flow, i) => (
          <button
            key={flow.src}
            type="button"
            onClick={() => setOpen(flow)}
            aria-label={`Open the ${flow.title} user flow full screen`}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-black/10 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e7bff]/50"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={flow.src}
                alt={`${flow.title} — user flow diagram`}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover object-left-top"
              />
              <span className="pointer-events-none absolute right-2 top-2 inline-flex size-6 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6" />
                  <path d="M9 21H3v-6" />
                  <path d="M21 3l-7 7" />
                  <path d="M3 21l7-7" />
                </svg>
              </span>
            </div>
            <div className="flex items-center gap-2 border-t border-black/[0.06] px-3 py-2 text-left">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1e7bff] text-[10px] font-medium text-white">
                {i + 1}
              </span>
              <span className="text-[11px] font-medium text-neutral-800 sm:text-xs">
                {flow.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      {caption && (
        <figcaption className="text-[11px] sm:text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}

      {open && (
        <Lightbox src={open.src} alt={`${open.title} — user flow`} onClose={() => setOpen(null)} />
      )}
    </figure>
  )
}

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(FlowGallery as unknown as { __wide?: boolean }).__wide = true
