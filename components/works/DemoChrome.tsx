'use client'

import { useEffect, useState, type RefObject } from 'react'
import Image from 'next/image'
import {
  ArrowClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsOutSimpleIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react'
import type { DemoView } from '@/content/demos'
import { cn } from '@/lib/utils'

/**
 * The demo console's window chrome, drawn as a browser rather than as a
 * generic title bar — tab strip on top, toolbar under it, the way Chrome on
 * macOS actually looks. The point is that the console reads as a real product
 * open in a real browser, not as a screenshot in a frame.
 *
 * Everything in it is interactive: the named entry points into the console
 * are the tabs, back/forward/reload drive the console's own history (it is
 * same-origin, so its `history` is reachable), and the address bar follows the
 * visitor around the product. The furniture Chrome would add and we have no
 * use for — new-tab, close buttons, the star, extensions, the profile, the
 * kebab — is left out rather than drawn inert, which also keeps the bar short.
 *
 * Colours follow Chrome's dark theme: the frame is the darkest, the toolbar
 * and active tab share a lighter grey, and the omnibox is cut back into the
 * frame colour, so it reads as a well rather than a raised pill.
 */


export function DemoChrome({
  views,
  viewIndex,
  onSwitch,
  address,
  addressHref,
  title,
  favicon,
  frameRef,
  fullScreenHref,
}: {
  views?: DemoView[]
  viewIndex: number
  onSwitch: (i: number) => void
  /** The product's real host + current path, e.g. 'atom.facilio.ai/helpdesk/home'. */
  address: string
  addressHref: string
  title: string
  /** The product mark shown on each tab; light-on-dark. */
  favicon: string
  /** The console, so the nav buttons can drive its history. */
  frameRef: RefObject<HTMLIFrameElement | null>
  fullScreenHref: string
}) {
  const [host, ...rest] = splitAddress(address)
  const tabs = views?.length ? views : [{ label: title, path: addressHref }]

  return (
    <div className="select-none bg-[#1b1b1b]">
      {/* ── Tab strip ─────────────────────────────────────────────────── */}
      <div className="flex h-9 items-end pl-3.5 pr-2.5">
        <div className="mr-3 flex shrink-0 self-center gap-[7px]" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div role="tablist" aria-label="Demo views" className="flex min-w-0 items-end">
          {tabs.map((v, i) => (
            <Tab
              key={v.path}
              label={v.label}
              favicon={favicon}
              active={i === viewIndex}
              onClick={() => onSwitch(i)}
              // Chrome draws a hairline between neighbouring inactive tabs,
              // and drops it either side of the active one.
              divider={i > 0 && i !== viewIndex && i - 1 !== viewIndex}
            />
          ))}
        </div>

        {/* Where Chrome puts "Ask Gemini" — the badge that says this is a demo. */}
        <span className="ml-auto hidden h-[22px] shrink-0 items-center gap-1.5 self-center rounded-full bg-emerald-500/15 px-2.5 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/30 sm:inline-flex">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          Product demo
        </span>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div className="flex h-10 items-center gap-0.5 bg-[#2f2f2f] px-2.5">
        <NavButton
          label="Back"
          onClick={() => frameRef.current?.contentWindow?.history.back()}
        >
          <ArrowLeftIcon size={16} />
        </NavButton>
        <NavButton
          label="Forward"
          onClick={() => frameRef.current?.contentWindow?.history.forward()}
        >
          <ArrowRightIcon size={16} />
        </NavButton>
        <NavButton
          label="Reload"
          onClick={() => frameRef.current?.contentWindow?.location.reload()}
        >
          <ArrowClockwiseIcon size={16} />
        </NavButton>

        {/* Address bar */}
        <a
          href={addressHref}
          target="_blank"
          rel="noopener"
          title={title}
          className="group ml-1.5 flex h-7 min-w-0 flex-1 items-center gap-2 rounded-full bg-[#1b1b1b] px-3 transition-colors hover:bg-[#232323]"
        >
          <SlidersHorizontalIcon
            size={14}
            className="shrink-0 text-neutral-300"
            aria-hidden="true"
          />
          {/* Chrome greys everything after the host. */}
          <span className="min-w-0 flex-1 truncate text-[12px] text-white">
            {host}
            <span className="text-neutral-400">{rest.join('')}</span>
          </span>
        </a>

        <a
          href={fullScreenHref}
          target="_blank"
          rel="noopener"
          className="ml-2 inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 text-[11px] text-neutral-300 ring-1 ring-white/10 transition-colors hover:bg-white/[0.16] hover:text-white"
        >
          <ArrowsOutSimpleIcon size={12} />
          <span className="hidden md:inline">Open in full screen</span>
        </a>
      </div>
    </div>
  )
}

/**
 * One browser tab. Tabs sit at Chrome's resting width and shrink together when
 * the strip runs short; the active one sits proud on the toolbar's own colour —
 * that shared edge is what joins the two rows into a window. An inactive tab's
 * hover is a pill inset inside its box rather than the box itself lighting up,
 * which is what keeps it feeling light.
 */
function Tab({
  label,
  favicon,
  active,
  onClick,
  divider,
}: {
  label: string
  favicon: string
  active: boolean
  onClick: () => void
  divider?: boolean
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'group relative flex h-8 w-[10rem] min-w-0 shrink items-center gap-2 px-3 text-[12px] transition-colors',
        active ? 'rounded-t-[9px] bg-[#2f2f2f] text-white' : 'text-neutral-300 hover:text-white',
        divider &&
          'after:absolute after:left-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:bg-white/20 after:transition-opacity hover:after:opacity-0',
      )}
    >
      {!active && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0.5 inset-y-1 rounded-[8px] bg-white/0 transition-colors duration-150 group-hover:bg-white/[0.1]"
        />
      )}
      <Image
        src={favicon}
        alt=""
        width={14}
        height={14}
        className="relative size-3.5 shrink-0"
        unoptimized
      />
      <span className="relative truncate">{label}</span>
      {/* The active tab flares into the toolbar at both feet. Each foot is
          only the curved sliver of toolbar colour — a radial gradient that is
          transparent inside the neighbour's corner radius — so it overlaps the
          next tab (and its hover pill) without painting a square over it. */}
      {active && (
        <>
          <span
            aria-hidden="true"
            className="absolute -left-[9px] bottom-0 size-[9px] bg-[radial-gradient(circle_at_0_0,transparent_9px,#2f2f2f_9.5px)]"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[9px] bottom-0 size-[9px] bg-[radial-gradient(circle_at_100%_0,transparent_9px,#2f2f2f_9.5px)]"
          />
        </>
      )}
    </button>
  )
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  )
}

/** Splits 'host/a/b?c' into ['host', '/a/b?c'] so the host can lead in white. */
function splitAddress(address: string): [string, ...string[]] {
  const cut = address.indexOf('/')
  return cut === -1 ? [address] : [address.slice(0, cut), address.slice(cut)]
}

/**
 * Where the console actually is right now. It is same-origin and routes with
 * pushState, which fires no event in the parent — so poll its location and let
 * the address bar (and the full-screen link) follow the visitor around the
 * product instead of sitting on the entry route.
 */
export function useConsolePath(
  frameRef: RefObject<HTMLIFrameElement | null>,
  entry: string,
): [string, (path: string) => void] {
  const [currentPath, setCurrentPath] = useState(entry)

  useEffect(() => {
    const read = () => {
      const win = frameRef.current?.contentWindow
      if (!win) return
      try {
        const next = win.location.pathname + win.location.search
        // about:blank before first load reports "blank" — keep the entry path.
        if (next && next !== 'blank' && next !== currentPath) setCurrentPath(next)
      } catch {
        /* cross-origin — leave the entry path in place */
      }
    }
    read()
    const id = window.setInterval(read, 300)
    return () => window.clearInterval(id)
  }, [currentPath, frameRef])

  return [currentPath, setCurrentPath]
}

/**
 * What the address bar shows. The `demo=…` flag only tells the mock which
 * state to boot into — it's not part of the product's URL, so keep it out.
 */
export function displayAddress(path: string): string {
  const shown = path.replace(/([?&])demo=[^&]*&?/, '$1').replace(/[?&]$/, '')
  return `atom.facilio.ai${shown}`
}
