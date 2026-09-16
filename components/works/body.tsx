import Image from 'next/image'
import { Children, isValidElement, type ReactElement } from 'react'
import { cn } from '@/lib/utils'
import { VideoPlayer } from '@/components/works/VideoPlayer'

/**
 * Reusable primitives for case-study bodies in `content/works/<slug>.tsx`.
 *
 * Compose freely. For interactive demos, just import any React component
 * directly — these are only here to reduce boilerplate for prose + media.
 */

export function Section({
  children,
  className,
  id,
  label,
  tocLabel,
}: {
  children: React.ReactNode
  className?: string
  /** Anchor id for scroll-spy + TOC click-jump. */
  id?: string
  /** Optional eyebrow rendered in the small left column on md+. */
  label?: string
  /** Label shown in the TOC. Defaults to `label`, then `id`. */
  tocLabel?: string
}) {
  // Label-less sections stay single-column, preserving legacy bodies.
  if (!label) {
    return (
      <section
        id={id}
        data-toc-label={tocLabel ?? id ?? ''}
        className={cn('flex flex-col gap-6 sm:gap-8 md:gap-10 scroll-mt-20', className)}
      >
        {children}
      </section>
    )
  }

  // Editorial layout: an auto-numbered eyebrow + large serif heading and all
  // prose sit in the left column; media children (Img / Video / TwoCol /
  // SceneShot — marked __wide) stack in the right column. Sections with no
  // media collapse to a single readable text column.
  const childArray = Children.toArray(children)
  const prose = childArray.filter(isProseChild)
  const media = childArray.filter((child) => !isProseChild(child))
  const hasMedia = media.length > 0

  return (
    <section
      id={id}
      data-toc-label={tocLabel ?? label ?? id ?? ''}
      className={cn(
        'cs-section grid grid-cols-1 gap-x-10 gap-y-6 scroll-mt-20 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-y-10',
        // Media sections get a generous gap above them, separating them from
        // the tight text block and from each other; text-only sections sit
        // close together so consecutive explanations read as one block.
        hasMedia ? 'lg:mt-40' : '',
        className,
      )}
    >
      {/* Left rail — serif heading. For media sections the prose also lives
          here (media fills the right) and the rail sticks while the media
          scrolls past. Text-only sections don't stick: the heading sits in
          the rail and the prose flows into the right column. */}
      <div
        className={cn(
          'flex flex-col gap-4 sm:gap-5',
          // top-24 parks the stuck rail clear of the case-study route's
          // sticky "Back to work" bar (68px: 2×py-6 plus a 20px line). At
          // the old top-10 the heading slid under the bar's blurred backdrop.
          hasMedia && 'lg:sticky lg:top-24 lg:self-start',
        )}
      >
        <h2
          className="text-[22px] sm:text-[26px] md:text-[30px] leading-[1.12] tracking-tight text-foreground"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {label}
        </h2>
        {hasMedia && prose.length > 0 && (
          <div className="flex flex-col gap-4 lg:max-w-[46ch]">{prose}</div>
        )}
      </div>

      {hasMedia ? (
        <div className="flex flex-col gap-5 sm:gap-6">{media}</div>
      ) : (
        prose.length > 0 && (
          <div className="flex flex-col gap-4 lg:pt-2">{prose}</div>
        )
      )}
    </section>
  )
}

export function Prose({ children }: { children: React.ReactNode }) {
  // Real paragraph spacing. At the old gap-0.5 two Texts fused into one
  // block, which is most of why the studies read as a wall of text.
  return <div className="flex flex-col gap-3 sm:gap-3.5">{children}</div>
}

/**
 * A scannable list for the "principles" / "what's in it" beats — the place
 * bodies used to stack three bolded paragraphs. Each Point is one line of
 * lead + one line of detail. `numbered` swaps the dot for a mono 01/02/03.
 */
export function Points({
  children,
  numbered,
}: {
  children: React.ReactNode
  numbered?: boolean
}) {
  return (
    <ul className="flex flex-col gap-2.5 sm:gap-3">
      {Children.map(children, (child, i) =>
        isValidElement(child) ? (
          <li className="grid grid-cols-[auto_1fr] gap-x-3">
            {numbered ? (
              <span
                aria-hidden
                className="mt-[0.35em] font-mono text-[10px] tracking-[0.18em] text-foreground/40"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            ) : (
              <span
                aria-hidden
                className="mt-[0.6em] size-1.5 rounded-full bg-foreground/35"
              />
            )}
            {child}
          </li>
        ) : null,
      )}
    </ul>
  )
}

export function Point({
  lead,
  children,
}: {
  /** Bolded opener, kept to a few words. */
  lead?: string
  children: React.ReactNode
}) {
  return (
    <p className="text-[13px] leading-5 text-foreground/75 sm:text-sm sm:leading-6">
      {lead && <strong className="font-semibold text-foreground">{lead} </strong>}
      {children}
    </p>
  )
}

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
      {children}
    </h2>
  )
}

export function Text({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] leading-5 text-foreground/75 sm:text-sm sm:leading-6">
      {children}
    </p>
  )
}

export type Aspect = '16/9' | '4/3' | '1/1' | '9/16' | '21/9'

const aspectClass: Record<Aspect, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '9/16': 'aspect-[9/16]',
  '21/9': 'aspect-[21/9]',
}

export function Img({
  src,
  alt = '',
  caption,
  aspect = '16/9',
  priority,
}: {
  src: string
  alt?: string
  caption?: string
  aspect?: Aspect
  priority?: boolean
}) {
  return (
    <figure className="flex flex-col gap-2">
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl bg-secondary/40 ring-1 ring-border',
          aspectClass[aspect],
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
          priority={priority}
        />
      </div>
      {caption && (
        <figcaption className="text-[11px] sm:text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}

export function Video({
  src,
  poster,
  caption,
  autoplay = true,
  loop = true,
  muted = true,
}: {
  src: string
  poster?: string
  caption?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}) {
  return (
    <figure className="flex flex-col gap-2">
      <VideoPlayer
        src={src}
        poster={poster}
        autoplay={autoplay}
        loop={loop}
        muted={muted}
        className="w-full rounded-2xl ring-1 ring-border bg-secondary/40"
      />
      {caption && (
        <figcaption className="text-[11px] sm:text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}

export function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-xl border border-border bg-secondary/30 px-3 sm:px-4 py-2.5 sm:py-3 text-[13px] sm:text-sm text-foreground/80 leading-relaxed">
      {children}
    </aside>
  )
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Internal helper for Section: split children into the prose that sits   */
/*  under the heading in the left rail, and the media that fills the       */
/*  right column.                                                         */
/*                                                                        */
/*  This tests for prose rather than for media, which looks backwards but  */
/*  is the only version that survives the server/client boundary. The      */
/*  media components aren't all in this module — SceneShot and PhoneScene  */
/*  are 'use client', so a server render of a body sees client-reference   */
/*  proxies that carry none of their own static properties. Tagging them   */
/*  with a `__wide` flag and reading it back therefore worked only while   */
/*  bodies rendered entirely on the client (the old lazy-loaded sheet);    */
/*  on the /works/[slug] route it read undefined and dropped every scene   */
/*  into the prose column, above the media instead of beside it.           */
/*                                                                        */
/*  The prose primitives, by contrast, all live here in this server        */
/*  module, so identity checks against them hold in both render modes.     */
/*  Treating everything else as media also does the right thing for the    */
/*  bespoke demo components bodies import directly (HelpdeskBento,         */
/*  FlowGallery, …) — they're visual, and they belong in the right column. */
/* ────────────────────────────────────────────────────────────────────── */

const PROSE_TYPES = new Set<unknown>([Prose, Text, Heading, Callout, Points])

function isProseChild(child: React.ReactNode): boolean {
  // Bare strings and numbers have no type to match; keep them with the prose.
  if (!isValidElement(child)) return true
  return PROSE_TYPES.has((child as ReactElement).type)
}
