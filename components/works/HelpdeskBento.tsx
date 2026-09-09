import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * A pinwheel bento of the Helpdesk product, shown after the overview. Four
 * cells map to what the case study covers: the three configurable agents
 * (Intake → Dispatch → Feedback) plus the one operational surface the humans
 * work in.
 *
 * Layout: two tall cells and two short cells interlocked (tall+short on the
 * left, short+tall on the right) so the sizes genuinely vary — a real bento,
 * not a uniform grid. The tall cells take the portrait-friendly frames; the
 * short cells take the wide ones.
 *
 * Each cell is a full-bleed cinematic image with a gradient scrim and the
 * title (Playfair) + subtext overlaid — so the cards read the same in light
 * and dark, since they're photos.
 *
 * Tagged `__wide` (like body's Img / SceneShot) so it spans the media column
 * when dropped directly into a labeled <Section>.
 */

export function HelpdeskBento() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:grid-rows-5 sm:gap-4 sm:min-h-[59rem]">
      {/* Intake — tall, top-left */}
      <Cell
        className="aspect-[4/3] sm:aspect-auto sm:col-start-1 sm:row-start-1 sm:row-span-3"
        src="/works/facilio-helpdesk-ai/intake.jpg"
        focus="object-[center_32%]"
        title={<>Answers every channel, in the <em>caller’s own words</em></>}
        body="Phone, WhatsApp, email, and a web widget — the agent takes the request as it’s spoken and raises the ticket."
        priority
      />

      {/* Dispatch — short, top-right */}
      <Cell
        className="aspect-[4/3] sm:aspect-auto sm:col-start-2 sm:row-start-1 sm:row-span-2"
        src="/works/facilio-helpdesk-ai/dispatch.jpg"
        focus="object-[center_55%]"
        title={<>The right technician, with the <em>reasoning shown</em></>}
        body="Matched against policies you wrote in plain English — score, runners-up, and every step on the surface."
      />

      {/* Feedback — short, bottom-left */}
      <Cell
        className="aspect-[4/3] sm:aspect-auto sm:col-start-1 sm:row-start-4 sm:row-span-2"
        src="/works/facilio-helpdesk-ai/surface.jpg"
        focus="object-[center_55%]"
        title={<>Closes <em>the loop</em> after the fix</>}
        body="You author the survey and the escalation rule that turns a poor rating back into an open ticket."
      />

      {/* Operational surface — tall, bottom-right */}
      <Cell
        className="aspect-[4/3] sm:aspect-auto sm:col-start-2 sm:row-start-3 sm:row-span-3"
        src="/works/facilio-helpdesk-ai/feedback.jpg"
        focus="object-[30%_45%]"
        title={<>Where the humans <em>watch it all</em> and take over</>}
        body="Inbox, Tickets, Technicians, Contacts — and Ask AI, which searches everything and deep-links you in."
      />
    </div>
  )
}

function Cell({
  src,
  focus,
  title,
  body,
  className,
  priority = false,
}: {
  src: string
  focus: string
  title: React.ReactNode
  body: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl ring-1 ring-white/10',
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        priority={priority}
        className={cn(
          'object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]',
          focus,
        )}
      />

      {/* Scrim — anchors the copy and keeps it legible over any frame. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6">
        <h3
          className="max-w-[24ch] text-[20px] font-medium leading-[1.15] tracking-tight text-white [&_em]:font-bold [&_em]:italic"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h3>
        <p className="max-w-[42ch] text-[12px] leading-5 text-white/70 sm:text-[13px]">
          {body}
        </p>
      </div>
    </div>
  )
}

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(HelpdeskBento as unknown as { __wide?: boolean }).__wide = true
