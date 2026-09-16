'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowSquareOutIcon, CursorClickIcon } from '@phosphor-icons/react'
import type { DemoView } from '@/content/demos'
import { DemoChrome, displayAddress, useConsolePath } from '@/components/works/DemoChrome'
import { cn } from '@/lib/utils'

/**
 * The live Facilio console, framed like a desktop window.
 *
 * The console is a real build of the product (public/helpdesk) with its API
 * answered from sample data by demo-mock.js. It is laid out at a fixed
 * desktop size and CSS-scaled to whatever width it's given, so it renders
 * above its own responsive breakpoints — the real UI, smaller, rather than a
 * collapsed mobile layout. Pointer events map through the transform, so the
 * scaled frame stays fully interactive.
 *
 * `DemoWindow` is the bare window (title bar + scaled iframe) for composing
 * into a hero; `DemoFrame` wraps it as a figure with a caption for use inside
 * a case-study body. Both hide the iframe below `md`, where the scale would
 * make text unreadable, and show an open-in-new-tab card instead.
 *
 * The chrome itself is `DemoChrome` — the window drawn as a real browser.
 */

const FRAME_W = 1600
const FRAME_H = 1000

export type { DemoView }

export function DemoWindow({
  path = '/helpdesk/home',
  title = 'Facilio Helpdesk — product demo',
  displayUrl,
  views,
  /** The product mark for the chrome's tabs; light-on-dark. */
  favicon = '/helpdesk/favicon-dark.png',
  className,
}: {
  /** Route inside the console to open first, e.g. '/dispatcher-agent/home'. */
  path?: string
  title?: string
  /** What the address bar reads. Defaults to the product's real host + path. */
  displayUrl?: string
  /**
   * Optional switcher in the chrome — named entry points into the console
   * ("Product", "Onboarding", …). Picking one reloads the frame at that
   * path. The first view is the default; `path` is ignored when given.
   */
  views?: DemoView[]
  favicon?: string
  className?: string
}) {
  const [viewIndex, setViewIndex] = useState(0)
  const entry = views?.[viewIndex]?.path ?? path
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(0.5)
  const [loaded, setLoaded] = useState(false)
  // Interaction gate. An iframe swallows wheel events, so a visitor scrolling
  // the page with the pointer over the console would get stuck on it. The
  // console is inert (pointer-events: none) until clicked; it hands input back
  // when the pointer leaves or the visitor clicks elsewhere on the page.
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!active) return
    const release = () => setActive(false)
    // A mousedown inside the iframe never reaches this document, so this only
    // fires for clicks on the surrounding page.
    document.addEventListener('mousedown', release)
    return () => document.removeEventListener('mousedown', release)
  }, [active])

  const [currentPath, setCurrentPath] = useConsolePath(frameRef, entry)

  const switchView = (i: number) => {
    if (i === viewIndex) return
    setViewIndex(i)
    setLoaded(false)
    setActive(false)
    setCurrentPath(views?.[i]?.path ?? path)
  }

  const address = displayUrl ?? displayAddress(currentPath)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / FRAME_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl bg-neutral-100 shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:rounded-[18px]',
        className,
      )}
    >
      <DemoChrome
        views={views}
        viewIndex={viewIndex}
        onSwitch={switchView}
        address={address}
        addressHref={currentPath}
        title={title}
        favicon={favicon}
        frameRef={frameRef}
        fullScreenHref={currentPath}
      />

      {/* Desktop: the scaled console */}
      <div
        ref={wrapRef}
        className="group/frame relative hidden w-full md:block"
        style={{ height: Math.round(FRAME_H * scale) }}
        onPointerLeave={() => setActive(false)}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
            Loading the console…
          </div>
        )}
        <iframe
          key={entry}
          ref={frameRef}
          src={entry}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn(
            'absolute left-0 top-0 border-0 bg-white transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            !active && 'pointer-events-none',
          )}
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />

        {/* Gate — sits over the inert console, catches the click that hands
            it input, and lets wheel events fall through to the page. */}
        {!active && loaded && (
          <button
            type="button"
            aria-label="Click to interact with the demo"
            onClick={() => setActive(true)}
            className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-end bg-transparent pb-5 outline-none"
          >
            {/* Sticky so the hint rides the viewport: it sits at the frame's
                bottom when the whole frame is on screen, and pins to the
                bottom of the viewport while the frame is taller than it. */}
            <span className="pointer-events-none sticky bottom-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-950/85 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 backdrop-blur transition-opacity duration-200 group-hover/frame:opacity-100 sm:text-xs">
              <CursorClickIcon size={13} />
              Click to interact
            </span>
          </button>
        )}
      </div>

      {/* Small screens: the console is a desktop product — send them to a tab. */}
      <div className="flex flex-col items-start gap-3 bg-white p-4 md:hidden">
        <p className="text-[12px] leading-5 text-neutral-700">
          The demo is a desktop console. Open it in a new tab to click through
          the real product on sample data.
        </p>
        <a
          href={path}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3.5 py-1.5 text-[12px] font-medium text-white"
        >
          Open the demo
          <ArrowSquareOutIcon size={14} />
        </a>
      </div>
    </div>
  )
}

export function DemoFrame({
  path,
  title,
  caption,
}: {
  path?: string
  title?: string
  caption?: string
}) {
  return (
    <figure className="flex flex-col gap-2">
      <DemoWindow path={path} title={title} />
      {caption && (
        <figcaption className="text-[11px] text-muted-foreground sm:text-xs">{caption}</figcaption>
      )}
    </figure>
  )
}

// Span both columns inside labeled <Section> layouts, matching body's Img.
;(DemoFrame as unknown as { __wide?: boolean }).__wide = true
