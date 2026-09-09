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
  const prose = childArray.filter((child) => !isWideChild(child))
  const media = childArray.filter((child) => isWideChild(child))
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
          hasMedia && 'lg:sticky lg:top-10 lg:self-start',
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
  return <div className="flex flex-col gap-0.5 sm:gap-1">{children}</div>
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
    <p className="text-[12px] sm:text-[13px] md:text-sm text-foreground/75 leading-5 sm:leading-6 md:leading-6">
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
/*  Internal helper for Section to identify "wide" children that should   */
/*  break out of the label column and span the full grid.                 */
/* ────────────────────────────────────────────────────────────────────── */

type WideTag = { __wide?: boolean }

;(Img as unknown as WideTag).__wide = true
;(Video as unknown as WideTag).__wide = true
;(TwoCol as unknown as WideTag).__wide = true

function isWideChild(child: React.ReactNode): boolean {
  if (!isValidElement(child)) return false
  const t = (child as ReactElement).type as unknown as WideTag | string
  return typeof t !== 'string' && Boolean(t?.__wide)
}
