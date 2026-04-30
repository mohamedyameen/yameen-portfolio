import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * Reusable primitives for case-study bodies in `content/works/<slug>.tsx`.
 *
 * Compose freely. For interactive demos, just import any React component
 * directly — these are only here to reduce boilerplate for prose + media.
 */

export function Section({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <section className={cn('flex flex-col gap-4', className)}>{children}</section>
}

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base md:text-lg font-semibold text-foreground mt-4">
      {children}
    </h2>
  )
}

export function Text({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm md:text-base text-foreground/75 leading-relaxed max-w-[65ch]">
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
          'relative w-full overflow-hidden rounded-md bg-secondary/40 border border-border',
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
        <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>
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
      <video
        src={src}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        controls={!autoplay}
        className="w-full rounded-md border border-border bg-secondary/40"
      />
      {caption && (
        <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  )
}

export function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-md border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground/80 leading-relaxed">
      {children}
    </aside>
  )
}
