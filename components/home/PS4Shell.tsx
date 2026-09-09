'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { lazyBodies } from '@/content/works/bodies'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'
import type { Work } from '@/content/works'
import { useSound } from '@/hooks/useSound'
import { cn } from '@/lib/utils'
import {
  CaseStudyTitle,
  CaseStudyMeta,
  CaseStudyTOC,
} from '@/components/works/CaseStudyChrome'
import { WorkHero } from '@/components/works/WorkHero'

type Props = { works: Work[] }

type CarouselItem = { work: Work; slug: string; tempId: number }

type Breakpoint = 'mobile' | 'tablet' | 'laptop' | 'desktop'

type SizeProfile = {
  tileW: number
  tileH: number
  expW: number
  expH: number
  focusScale: number
  focusScaleExpanded: number
  /**
   * Top-right notch size as a percentage of tile width. Percentage (not px)
   * so the polygon shape stays visually consistent between compact and
   * expanded modes — fixed px would eat a much larger fraction of the
   * smaller expanded tiles.
   */
  notchPct: number
}

// Notch ratio shared by every breakpoint so the polygon proportions stay
// consistent across compact and expanded modes.
const NOTCH_RATIO = 0.20

const SIZES: Record<Breakpoint, SizeProfile> = {
  mobile: {
    tileW: 180,
    tileH: 180,
    expW: 54,
    expH: 54,
    focusScale: 1.25,
    focusScaleExpanded: 1.12,
    notchPct: NOTCH_RATIO * 100,
  },
  tablet: {
    tileW: 240,
    tileH: 240,
    expW: 58,
    expH: 58,
    focusScale: 1.4,
    focusScaleExpanded: 1.18,
    notchPct: NOTCH_RATIO * 100,
  },
  laptop: {
    tileW: 200,
    tileH: 200,
    expW: 58,
    expH: 58,
    focusScale: 1.5,
    focusScaleExpanded: 1.22,
    notchPct: NOTCH_RATIO * 100,
  },
  desktop: {
    tileW: 240,
    tileH: 240,
    expW: 66,
    expH: 66,
    focusScale: 1.55,
    focusScaleExpanded: 1.24,
    notchPct: NOTCH_RATIO * 100,
  },
}

// Default to desktop for SSR; the client-side effect refines this on mount.
const SSR_BREAKPOINT: Breakpoint = 'desktop'
// Critically-damped spring for navigation (x + rotate). Underdamped springs
// produce an overshoot at the end of long horizontal slides, which reads as
// motion sickness during arrow-key navigation. ζ ≈ 1.0 settles cleanly.
const TILE_FOCUS_SPRING = {
  type: 'spring' as const,
  stiffness: 190,
  damping: 30,
  mass: 0.95,
  restDelta: 0.0008,
}
const EASE_OUT = [0.16, 1, 0.3, 1] as const
const SLIDE_SPRING = {
  type: 'spring' as const,
  stiffness: 175,
  damping: 25,
  mass: 0.9,
  restDelta: 0.0005,
}
// Slower, heavier variant used only while the panel is closing. Open keeps
// SLIDE_SPRING (snappier) so the user feedback on Enter still feels crisp,
// but Escape/close glides back instead of springing back.
const CLOSE_SPRING = {
  type: 'spring' as const,
  stiffness: 115,
  damping: 26,
  mass: 1.1,
  restDelta: 0.0005,
}

function coverFor(work: Work, slot: 'tile' | 'backdrop'): string {
  if (work.type === 'image' && work.media?.src) return work.media.src
  if (work.cover) return work.cover
  if (work.slug === 'mellow') return '/works/mellow/hero-cover.jpg'
  const dims = slot === 'tile' ? '600/600' : '1600/1000'
  return `https://picsum.photos/seed/${work.slug}-cover/${dims}`
}

export default function PS4Shell({ works }: Props) {
  const { playHover, playClick } = useSound()
  const [isExpanded, setIsExpanded] = useState(false)
  // Active only while the close animation is in flight. Swaps in CLOSE_SPRING
  // for the frame, spacers, detail container, and the focused tile's size
  // animations so they all share the slower glide together (no clipping).
  const [isClosing, setIsClosing] = useState(false)
  const layoutSpring = isClosing ? CLOSE_SPRING : SLIDE_SPRING

  const initialList: CarouselItem[] = useMemo(
    () =>
      works.map<CarouselItem>((w, i) => ({
        work: w,
        slug: w.slug,
        tempId: i,
      })),
    [works],
  )

  const [listOrder, setListOrder] = useState<CarouselItem[]>(initialList)

  // Re-seed if the underlying works data ever changes.
  useEffect(() => {
    setListOrder(initialList)
  }, [initialList])

  // Center index follows the reference component's parity rule.
  const centerIndex =
    listOrder.length % 2
      ? (listOrder.length + 1) / 2
      : listOrder.length / 2

  const focusedItem = listOrder[centerIndex] as CarouselItem | undefined
  const focused = focusedItem?.work ?? null

  // Track viewport breakpoint so the carousel can size itself appropriately.
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(SSR_BREAKPOINT)
  useEffect(() => {
    const compute = (): Breakpoint => {
      if (typeof window === 'undefined') return SSR_BREAKPOINT
      if (window.matchMedia('(min-width: 1440px)').matches) return 'desktop'
      if (window.matchMedia('(min-width: 1024px)').matches) return 'laptop'
      if (window.matchMedia('(min-width: 640px)').matches) return 'tablet'
      return 'mobile'
    }
    const update = () => setBreakpoint(compute())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const sizes = SIZES[breakpoint]

  // Mac keyboards label the confirm key "Return"; Windows/Linux label it
  // "Enter". Detect on mount so the chip matches the user's actual keyboard.
  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    if (typeof navigator === 'undefined') return
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform))
  }, [])

  // Tile sizing collapses when expanded so the detail panel has more room.
  const tileW = isExpanded ? sizes.expW : sizes.tileW
  const tileH = isExpanded ? sizes.expH : sizes.tileH
  const focusScale = isExpanded ? sizes.focusScaleExpanded : sizes.focusScale
  // Viewport must accommodate the focused tile (scaled by focusScale) PLUS
  // its vertical stagger offset (ty = -tileH * 0.17). Otherwise the focused
  // tile gets clipped at the top in compact mode. The +24 is breathing room.
  const carouselViewportH = tileH * (focusScale + 0.34) + 24

  // Looping rotation: positive steps shift items off the front and append
  // them to the back (with fresh tempIds so framer treats the wrapped card
  // as a brand-new element instead of teleporting the same DOM node).
  const moveFocus = useCallback(
    (steps: number) => {
      if (steps === 0) return
      setListOrder((prev) => {
        const next = [...prev]
        if (steps > 0) {
          for (let i = steps; i > 0; i--) {
            const item = next.shift()
            if (!item) return prev
            next.push({ ...item, tempId: Math.random() })
          }
        } else {
          for (let i = steps; i < 0; i++) {
            const item = next.pop()
            if (!item) return prev
            next.unshift({ ...item, tempId: Math.random() })
          }
        }
        return next
      })
      playHover()
    },
    [playHover],
  )

  const openFocused = useCallback(() => {
    if (!focusedItem) return
    playClick()
    setIsExpanded(true)
  }, [focusedItem, playClick])

  const collapse = useCallback(() => {
    playClick()
    setIsClosing(true)
    setIsExpanded(false)
  }, [playClick])

  // CLOSE_SPRING settles within ~900ms; reset the flag once the animation has
  // landed so the next open uses SLIDE_SPRING and navigation still feels crisp.
  useEffect(() => {
    if (!isClosing) return
    const id = window.setTimeout(() => setIsClosing(false), 600)
    return () => window.clearTimeout(id)
  }, [isClosing])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = document.activeElement as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return
      }
      if (e.key === 'Escape' && isExpanded) {
        e.preventDefault()
        collapse()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        moveFocus(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        moveFocus(1)
      } else if (e.key === 'Enter' && !isExpanded) {
        e.preventDefault()
        openFocused()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moveFocus, openFocused, collapse, isExpanded])

  return (
    <section
      id="works"
      className="relative isolate flex h-[calc(100dvh-72px)] min-h-[600px] flex-col overflow-hidden bg-black md:h-[calc(100dvh-56px)] lg:h-dvh"
    >
      {/* Static backdrop — single bg image, softly blurred with a light overlay */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/works/mellow/bg-sky.jpg"
          alt=""
          className="h-full w-full scale-105 object-cover opacity-80 blur-[2px]"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />
        {/* Expanded-state readability layer — gradient + extra blur so the
            detail panel copy passes contrast against the busy backdrop. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="pointer-events-none absolute inset-0 backdrop-blur-xl"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.78) 45%, rgba(0,0,0,0.92) 100%)',
          }}
        />
      </div>

      {/* Foreground — sidebar handles chrome on the left, no top inset needed here */}
      <div className="relative z-10 flex h-full flex-col">
        <AnimatePresence mode="wait">
          {listOrder.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid flex-1 place-items-center px-10 text-center text-white/55"
            >
              <p className="text-sm">Nothing here yet.</p>
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="flex flex-1 flex-col pt-4 md:pt-5"
            >
              {/* Top spacer collapses when expanded so carousel rises */}
              <motion.div
                className="basis-0"
                animate={{ flexGrow: isExpanded ? 0.0001 : 1 }}
                transition={layoutSpring}
              />

              {/* Carousel — stagger layout: cards radiate from a centered focus tile */}
              <motion.div
                className="relative shrink-0 overflow-hidden"
                initial={{
                  height: sizes.tileH * (sizes.focusScale + 0.34) + 24,
                }}
                animate={{ height: carouselViewportH }}
                transition={layoutSpring}
              >
                {listOrder.map((item, index) => {
                  // Reference parity rule — keeps the center exactly at position 0.
                  const position =
                    listOrder.length % 2
                      ? index - (listOrder.length + 1) / 2
                      : index - listOrder.length / 2
                  const isFocused = position === 0
                  const tx = (tileW / 1.5) * position
                  // Stagger scales with the current tile size so it looks
                  // right on every breakpoint (was hardcoded for desktop).
                  const ty = isFocused
                    ? -tileH * 0.17
                    : (position % 2 ? 1 : -1) * tileH * 0.075
                  const rot = isFocused ? 0 : position % 2 ? 2.5 : -2.5
                  const distance = Math.abs(position)
                  return (
                    <motion.button
                      key={item.tempId}
                      type="button"
                      onClick={() => {
                        if (isFocused) openFocused()
                        else moveFocus(position)
                      }}
                      onMouseEnter={() => {
                        if (!isFocused) playHover()
                      }}
                      className={cn(
                        'absolute left-1/2 top-1/2 cursor-pointer outline-none',
                        'transition-colors duration-200',
                        isFocused
                          ? 'bg-white'
                          : 'bg-white/25 hover:bg-white/65',
                        'focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0',
                      )}
                      initial={{
                        // Use the *current* tile size (respects compact /
                        // expanded). Otherwise a card added during navigation
                        // mounts at the compact size and then shrinks to the
                        // expanded size, producing a bigger-to-smaller pop.
                        width: tileW,
                        height: tileH,
                        x: -tileW / 2 + tx,
                        y: -tileH / 2 + ty,
                        rotate: rot,
                        scale: isFocused ? focusScale : 1,
                      }}
                      animate={{
                        width: tileW,
                        height: tileH,
                        x: -tileW / 2 + tx,
                        y: -tileH / 2 + ty,
                        rotate: rot,
                        scale: isFocused ? focusScale : 1,
                        zIndex: isFocused ? 10 : 6 - distance,
                      }}
                      transition={{
                        // x + rotate stay snappy for navigation feel.
                        default: TILE_FOCUS_SPRING,
                        // width/height/y/scale are all driven by tileH/focusScale,
                        // which change when isExpanded toggles. They must share
                        // the frame's spring so the focused tile never grows
                        // faster than the viewport — otherwise overflow-hidden
                        // clips its top during the collapse transition.
                        width: layoutSpring,
                        height: layoutSpring,
                        y: layoutSpring,
                        scale: layoutSpring,
                      }}
                      style={{
                        // Outer pentagon — the button's bg paints this shape,
                        // becoming the visible "border" along all 5 edges.
                        // Notch is expressed as a percentage of width so the
                        // polygon stays visually identical in compact and
                        // expanded modes (a fixed px notch would dominate the
                        // tiny expanded tiles).
                        clipPath: `polygon(0 0, ${100 - sizes.notchPct}% 0, 100% ${sizes.notchPct}%, 100% 100%, 0 100%)`,
                      }}
                    >
                      {/*
                        Inner pentagon, inset 2px perpendicular to every edge
                        (including the 45° diagonal). The gap between the two
                        clip paths is the 2px border ring — perfectly even on
                        all five sides, no seam at the fold. The 28.83 ≈ 26 + 2√2
                        is the exact inset intersection on the diagonal corner.
                      */}
                      <div
                        className="absolute inset-0"
                        style={{
                          // Inner pentagon, inset 2px perpendicular to every
                          // edge. The 0.83px (= 2(√2 − 1)) shift along the 45°
                          // diagonal preserves a uniform 2px border ring. The
                          // notch itself is a percentage so it scales with the
                          // tile in lockstep with the outer clip.
                          clipPath: `polygon(2px 2px, calc(${100 - sizes.notchPct}% - 0.83px) 2px, calc(100% - 2px) calc(${sizes.notchPct}% + 0.83px), calc(100% - 2px) calc(100% - 2px), 2px calc(100% - 2px))`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={coverFor(item.work, 'tile')}
                          alt={item.work.name}
                          className="pointer-events-none h-full w-full object-cover"
                          draggable={false}
                        />
                        {/* Readability gradient — same on every card so the
                            overlaid name/summary stay legible across states. */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        {/* Name + summary overlay — kept mounted so the text
                            fades out instead of popping when expand triggers
                            (mounted toggling would clip the truncation mid-
                            animation). Opacity 0 in expanded mode. */}
                        <motion.div
                          initial={{ opacity: 0, scale: 1, x: '-50%' }}
                          animate={{
                            opacity: isExpanded
                              ? 0
                              : isFocused
                                ? 1
                                : 0.75,
                            // Scale tracks the card's width ratio so the
                            // text container visually grows/shrinks in
                            // lockstep with the tile, riding the same
                            // spring. Layout (width + line-clamp) stays
                            // at the compact size, so the truncation is
                            // computed once and never reflows.
                            scale: isExpanded
                              ? sizes.expW / sizes.tileW
                              : 1,
                            x: '-50%',
                          }}
                          transition={{
                            opacity: {
                              duration: isExpanded ? 0.18 : 0.32,
                              ease: EASE_OUT,
                            },
                            scale: layoutSpring,
                          }}
                          style={{
                            width: sizes.tileW,
                            left: '50%',
                            bottom: 0,
                            transformOrigin: 'bottom center',
                          }}
                          className="pointer-events-none absolute z-10 flex flex-col gap-1 px-3 pb-3 text-left"
                        >
                          <h3 className="line-clamp-1 text-[11px] font-semibold leading-tight text-white">
                            {item.work.name}
                          </h3>
                          {item.work.summary && (
                            <p className="line-clamp-2 text-[8px] leading-snug text-white/70">
                              {item.work.summary}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>

              {/* Bottom spacer mirrors the top one so carousel centers vertically in compact mode */}
              <motion.div
                className="basis-0"
                animate={{ flexGrow: isExpanded ? 0.0001 : 1 }}
                transition={layoutSpring}
              />

              {/* Inline detail panel — kept mounted, grows from 0 height to fill remaining space */}
              <motion.div
                animate={{ flexGrow: isExpanded ? 1 : 0.0001 }}
                transition={layoutSpring}
                className="min-h-0 basis-0 overflow-hidden"
                aria-hidden={!isExpanded}
              >
                <AnimatePresence mode="wait">
                  {focused ? (
                    <DetailPanel
                      key={focused.slug}
                      work={focused}
                      isExpanded={isExpanded}
                      onClose={collapse}
                    />
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keybinding chips — each group is one action with its bound key(s)
          rendered as clickable kbd-style buttons + a single descriptive
          label. ← + → share the "Navigate" label since they're one action
          with two keys. Hidden on small screens. */}
      <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-4 sm:flex">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => moveFocus(-1)}
            aria-label="Previous"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <ArrowLeftIcon size={16} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => moveFocus(1)}
            aria-label="Next"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <ArrowRightIcon size={16} weight="bold" />
          </button>
          <span className="text-[11px] text-white/55">navigate</span>
        </div>
        {isExpanded ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={collapse}
              aria-label="Close"
              className="inline-flex h-7 items-center justify-center rounded-full bg-black/30 px-2.5 text-[11px] font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              esc
            </button>
            <span className="text-[11px] text-white/55">close</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openFocused}
              aria-label="Open"
              className="inline-flex h-7 items-center justify-center rounded-full bg-black/30 px-2.5 text-[11px] font-medium text-white/85 backdrop-blur-md transition-colors hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {isMac ? 'return' : 'enter'}
            </button>
            <span className="text-[11px] text-white/55">open</span>
          </div>
        )}
      </div>
    </section>
  )
}

function DetailPanel({
  work,
  isExpanded,
  onClose: _onClose,
}: {
  work: Work
  isExpanded: boolean
  onClose: () => void
}) {
  const Body = lazyBodies[work.slug] ?? null

  const scrollRef = useRef<HTMLDivElement | null>(null)
  // Fade strength at each edge: 0 = no fade (hard cut), 1 = full eased fade.
  // Driven by scroll position so the top fade only appears once the user has
  // scrolled past the start, and the bottom fade disappears at the end.
  const [topFade, setTopFade] = useState(0)
  const [bottomFade, setBottomFade] = useState(1)

  const recompute = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    // Ramp the fade in over the first/last 72px of scroll so it eases in
    // smoothly instead of snapping on the moment scrollTop > 0.
    const RAMP = 72
    setTopFade(Math.min(1, el.scrollTop / RAMP))
    setBottomFade(Math.min(1, (max - el.scrollTop) / RAMP))
  }, [])

  useEffect(() => {
    recompute()
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => recompute()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', recompute)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recompute)
    }
  }, [recompute, work.slug])

  // Build a fade mask that scales with the current fade strength.
  // At strength = 0 the start/end stops collapse to opaque so the edge looks
  // like a clean cut (no clipped-text feel). At strength = 1 it eases
  // smoothly with intermediate alpha stops.
  const fadeMask = (top: number, bottom: number) => {
    const t1 = Math.round(24 * top)
    const t2 = Math.round(48 * top)
    const t3 = Math.round(72 * top)
    const b1 = Math.round(24 * bottom)
    const b2 = Math.round(48 * bottom)
    const b3 = Math.round(72 * bottom)
    const a2Top = 0.35 * top + (1 - top)
    const a3Top = 0.75 * top + (1 - top)
    const a2Bot = 0.35 * bottom + (1 - bottom)
    const a3Bot = 0.75 * bottom + (1 - bottom)
    return `linear-gradient(to bottom,
      rgba(0,0,0,${top === 0 ? 1 : 0}) 0,
      rgba(0,0,0,${a2Top}) ${t1}px,
      rgba(0,0,0,${a3Top}) ${t2}px,
      rgba(0,0,0,1) ${t3}px,
      rgba(0,0,0,1) calc(100% - ${b3}px),
      rgba(0,0,0,${a3Bot}) calc(100% - ${b2}px),
      rgba(0,0,0,${a2Bot}) calc(100% - ${b1}px),
      rgba(0,0,0,${bottom === 0 ? 1 : 0}) 100%)`
  }
  const mask = fadeMask(topFade, bottomFade)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isExpanded ? 1 : 0, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{
        opacity: { duration: isExpanded ? 0.35 : 0.22, ease: EASE_OUT },
        y: { duration: 0.3, ease: EASE_OUT },
      }}
      className="relative flex h-full min-h-0 flex-1 flex-col"
      style={{
        // Pin theme tokens to dark-mode values so the body primitives
        // (text-foreground, bg-secondary/40, ring-border, text-muted-foreground)
        // stay legible against the fixed dark backdrop in both themes.
        ['--foreground' as string]: 'oklch(0.985 0 0)',
        ['--secondary' as string]: 'oklch(1 0 0 / 6%)',
        ['--muted-foreground' as string]: 'oklch(0.78 0 0)',
        ['--border' as string]: 'oklch(1 0 0 / 12%)',
      }}
    >
      {/* Left rail — TOC with scroll-spy. Top-anchored so its first row
          lines up with the case-study title. Hidden under xl since the
          panel is already constrained. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-44 items-start pl-6 pt-2 xl:flex">
        <CaseStudyTOC scrollRef={scrollRef} bodyKey={work.slug} />
      </div>

      <div
        ref={scrollRef}
        data-lenis-prevent
        className="flex h-full flex-col overflow-y-auto overscroll-contain px-6 pb-20 pt-0.5 sm:px-10 md:px-16 xl:pl-52"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8 md:gap-10">
          <CaseStudyTitle work={work} />

          {/* Hero media — bespoke showcase for works that define one
              (Mellow), otherwise the flat cover image / video. */}
          {work.slug === 'mellow' ? (
            <WorkHero work={work} />
          ) : (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-1 ring-white/15">
              {work.type === 'video' && work.media ? (
                <video
                  src={work.media.src}
                  poster={work.media.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={
                    work.type === 'image' && work.media
                      ? work.media.src
                      : coverFor(work, 'backdrop')
                  }
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          <CaseStudyMeta work={work} />

          {/* Body — inline case study. Scoped heading override so the dark
              panel reads with stronger hierarchy without affecting the
              shared body primitives used by /works/[slug] and WorkSheet. */}
          {Body && (
            <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10 [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:md:text-xl [&_h2]:tracking-tight">
              <Suspense
                fallback={
                  <div className="h-32 w-full animate-pulse rounded-md bg-white/[0.04]" />
                }
              >
                <Body />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
