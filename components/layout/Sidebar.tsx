'use client'
import { useState, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
  ListIcon,
  XIcon,
} from '@phosphor-icons/react'
import LiveClock from './LiveClock'
import ThemeToggle from './ThemeToggle'
import SoundToggle from './SoundToggle'
import TypewriterName from './TypewriterName'
import { useSound } from '@/hooks/useSound'
import { useWeather, type WeatherCondition } from '@/hooks/useWeather'
import { InlineMusicPlayer } from '@/components/music/MusicPlayer'

const CONDITION_LABEL: Record<WeatherCondition, string> = {
  clear: 'Clear', clouds: 'Cloudy', fog: 'Foggy',
  rain: 'Rain', snow: 'Snow', thunderstorm: 'Thunder',
}

const livingWords = [
  { text: 'living', shine: 'shine-emerald', emoji: '🌿', tilt: 14 },
  { text: 'spark',  shine: 'shine-sky',     emoji: '💡', tilt: -12 },
  { text: 'kick',   shine: 'shine-orange',  emoji: '⚽', tilt: 18 },
  { text: 'laugh',  shine: 'shine-pink',    emoji: '😆', tilt: -16 },
  { text: 'vibe',   shine: 'shine-violet',  emoji: '✨', tilt: 12 },
]

function AnimatedHeadline() {
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % livingWords.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <h1 className="text-[26px] font-medium leading-[1.2] tracking-tight text-foreground">
      <span className="block">Hey, I&apos;m Yameen.</span>
      <span className="block text-foreground/55">
        I{' '}
        <em style={{ fontFamily: 'var(--font-playfair)' }} className="italic font-bold text-foreground">
          design
        </em>{' '}
        things for a{' '}
        <span className="relative inline-block" style={{ marginLeft: '0.15em' }}>
          <span className="inline-block" style={{ clipPath: 'inset(0)', lineHeight: 1.2 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={livingWords[wordIdx].text}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                className={`inline-block whitespace-nowrap text-shine ${livingWords[wordIdx].shine}`}
              >
                {livingWords[wordIdx].text}.
              </motion.span>
            </AnimatePresence>
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={livingWords[wordIdx].text + '-emoji'}
              initial={{ y: 14, x: -10, rotate: -30, scale: 0.4, opacity: 0 }}
              animate={{ y: 0, x: 0, rotate: livingWords[wordIdx].tilt, scale: 1, opacity: 1 }}
              exit={{ y: -18, x: 14, rotate: 40, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="pointer-events-none select-none absolute -top-3 -right-3 text-lg text-foreground"
              style={{ filter: 'saturate(1.15)' }}
              aria-hidden
            >
              {livingWords[wordIdx].emoji}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </h1>
  )
}

const PANEL_EASE = [0.22, 1, 0.36, 1] as const
const PANEL_DURATION = 0.38
const PANEL_LAYOUT_SPRING = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 30,
  mass: 0.8,
}

/* Cascading entrance for the hero — each block rises out of a blur. */
const rise = {
  initial: { opacity: 0, y: 14, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
}
const riseAt = (i: number) => ({ delay: 0.05 + i * 0.09, duration: 0.5, ease: PANEL_EASE })

function SidebarIntro({
  onOpenAbout,
}: {
  onOpenAbout: () => void
}) {
  const { playHover, playClick } = useSound()
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(3px)', position: 'absolute', top: 0, left: 0, right: 0 }}
      transition={{
        duration: PANEL_DURATION,
        ease: PANEL_EASE,
        opacity: { duration: PANEL_DURATION * 0.75, ease: PANEL_EASE },
      }}
      className="flex flex-col gap-6"
    >
      <motion.h1
        {...rise}
        transition={riseAt(0)}
        className="text-[26px] font-medium leading-[1.2] tracking-tight text-foreground"
      >
        Designing{' '}
        <em
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="cursor-default font-bold not-italic text-foreground/55 transition-colors duration-300 hover:text-rose-400"
        >
          complex
        </em>{' '}
        products,
        <br />
        crafting{' '}
        <em
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="cursor-default font-bold italic text-foreground/55 transition-colors duration-300 hover:text-emerald-400"
        >
          intuitive
        </em>{' '}
        experiences,
        <br />
        building{' '}
        <em
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="cursor-default font-bold italic text-foreground/55 transition-colors duration-300 hover:text-blue-400"
        >
          systems
        </em>{' '}
        that scale.
      </motion.h1>
      <motion.p {...rise} transition={riseAt(1)} className="text-sm leading-relaxed text-foreground/80">
        Think of this as my desk — products I&apos;ve shipped, prototypes
        I&apos;ve kept, and the experiments I started just to see what would
        happen. Some intentional, some impulsive, all worth keeping around.
      </motion.p>
      <motion.button
        {...rise}
        transition={riseAt(2)}
        type="button"
        onMouseEnter={playHover}
        onClick={() => {
          playClick()
          onOpenAbout()
        }}
        className="group inline-flex items-center gap-1 self-start text-sm text-foreground/55 transition-colors hover:text-foreground"
      >
        more about me
        <ArrowUpRightIcon
          size={14}
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </motion.button>
    </motion.div>
  )
}

function SidebarAbout({ onBack }: { onBack: () => void }) {
  const { playHover, playClick } = useSound()
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -8, filter: 'blur(3px)', position: 'absolute', top: 0, left: 0, right: 0 }}
      transition={{
        duration: PANEL_DURATION,
        ease: PANEL_EASE,
        opacity: { duration: PANEL_DURATION * 0.75, ease: PANEL_EASE },
      }}
      className="flex flex-col gap-6"
    >
      <button
        type="button"
        onMouseEnter={playHover}
        onClick={() => {
          playClick()
          onBack()
        }}
        className="group inline-flex items-center gap-1 self-start text-sm text-foreground/55 transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        back
      </button>

      <AnimatedHeadline />

      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-foreground/80">
          Product Designer focused on AI-native B2B tools — workflow surfaces,
          data-dense dashboards, and Ask AI that holds up in production. I
          lead design at Facilio, where I spend most days turning messy
          facilities-management problems into interfaces that feel obvious.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          I came up through computer science engineering, expecting to ship
          systems and write features. Somewhere along the way I noticed I
          cared less about how cleanly things compiled and more about how they
          felt to use — the small frictions, the tiny delights, the way a
          button can feel honest or sneaky. So I drifted, slowly, into design,
          and never really came back.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-foreground/60">
        <span>On loop ·</span>
        <InlineMusicPlayer />
      </div>
    </motion.div>
  )
}

const socials = [
  {
    label: 'Email',
    href: 'mailto:mohamedyameen1999@gmail.com',
    icon: EnvelopeSimpleIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/mohamed-yameen-83681315a',
    icon: LinkedinLogoIcon,
  },
]

function SidebarSocials() {
  const { playHover, playClick } = useSound()
  return (
    <div className="flex items-center gap-1">
      {socials.map(({ label, href, icon: Icon }) => {
        const external = href.startsWith('http')
        return (
          <a
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-label={label}
            onMouseEnter={playHover}
            onClick={playClick}
            className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            <Icon size={20} weight="regular" />
          </a>
        )
      })}
    </div>
  )
}

function SidebarFooter() {
  const { condition, temperature } = useWeather()
  return (
    <div className="flex items-end justify-between gap-4 pb-7 xl:pb-8">
      <div className="flex flex-col gap-1 [&_span]:!text-foreground/75">
        <LiveClock />
        <div className="text-xs tracking-wide text-foreground/60">
          {temperature !== null && condition
            ? <>Chennai · {Math.round(temperature)}° · {CONDITION_LABEL[condition]}</>
            : <span className="opacity-50">Loading weather…</span>}
        </div>
      </div>
      <SidebarSocials />
    </div>
  )
}

function SidebarContent({
  onClose,
  controls,
  hideName,
  onAboutChange,
}: {
  onClose?: () => void
  controls?: ReactNode
  hideName?: boolean
  /** Fires when the intro ⇄ about view flips (desktop uses it to blur the backdrop). */
  onAboutChange?: (open: boolean) => void
}) {
  const { playHover, playClick } = useSound()
  const [showAbout, setShowAbout] = useState(false)
  useEffect(() => {
    onAboutChange?.(showAbout)
  }, [showAbout, onAboutChange])

  return (
    <div className="flex shrink-0 flex-col gap-10">
      {!hideName && (
        <div className="flex items-center gap-3 leading-none">
          <Link
            href="/"
            onMouseEnter={playHover}
            onClick={() => {
              playClick()
              onClose?.()
            }}
            className="min-w-0 flex-1 tracking-tight text-foreground"
          >
            <TypewriterName className="text-sm" />
          </Link>
          {controls}
        </div>
      )}

      <motion.div
        layout
        transition={{ layout: PANEL_LAYOUT_SPRING }}
        className="relative"
      >
        <AnimatePresence initial={false}>
          {showAbout ? (
            <SidebarAbout onBack={() => setShowAbout(false)} />
          ) : (
            <SidebarIntro onOpenAbout={() => setShowAbout(true)} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/**
 * Ambient video stack shared by the desktop panel and the mobile hero.
 *
 * The clip is 512×768 (2:3) while both containers are much taller than that,
 * so stretching it edge-to-edge upscales and crops it badly. Instead a heavily
 * blurred, oversized copy fills the container as a slowly drifting colour
 * glow, and the sharp clip sits at its true ratio at the bottom, edges masked
 * into that glow. Same footage in both layers, so the join is seamless.
 *
 * `media` gates the <source> so only the visible variant downloads the file
 * (desktop panel ≥ lg, mobile hero < lg). `veiled` frosts the whole surface
 * while the "more about me" view is open.
 */
function AmbientBackdrop({ veiled, media }: { veiled: boolean; media: string }) {
  const ref = useRef<HTMLDivElement>(null)
  // Honour prefers-reduced-motion: leave the poster frames, don't play.
  useEffect(() => {
    const root = ref.current
    if (!root || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      root.querySelectorAll('video').forEach((v) => {
        if (mq.matches) v.pause()
        else void v.play().catch(() => {})
      })
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        poster="/bg/sidebar-ambient.jpg"
        className="sidebar-glow absolute inset-0 size-full object-cover opacity-80 blur-3xl saturate-[1.4]"
      >
        <source src="/bg/sidebar-ambient.mp4" type="video/mp4" media={media} />
      </video>
      <div
        className="absolute inset-x-0 bottom-0 aspect-[2/3] w-full"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 30%, black 82%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 30%, black 82%, transparent 100%)',
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          poster="/bg/sidebar-ambient.jpg"
          className="size-full object-cover"
        >
          <source src="/bg/sidebar-ambient.mp4" type="video/mp4" media={media} />
        </video>
      </div>
      {/* Grain + vignette: one cinematic surface over both video layers. */}
      <div className="film-grain absolute inset-0 opacity-[0.08] mix-blend-overlay" />
      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.55)]" />
      {/* Scrims behind the copy (top) and footer (bottom), fading to clear. */}
      <div className="absolute inset-x-0 top-0 h-[58%] bg-gradient-to-b from-background/85 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-background/90 via-background/45 to-transparent" />
      {/* Reading veil — frosts everything while the about view is open. */}
      <motion.div
        initial={false}
        animate={{ opacity: veiled ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-background/70 backdrop-blur-2xl"
      />
    </div>
  )
}

const Controls = () => (
  <div className="flex items-center gap-1">
    <SoundToggle />
    <ThemeToggle />
  </div>
)

export default function Sidebar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [open, setOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [heroAboutOpen, setHeroAboutOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        // `dark` pins this panel to the dark palette in both themes: the
        // footage is a night scene, and light-mode fades washed it out.
        className="dark fixed left-0 top-0 z-30 hidden h-screen w-[28rem] flex-col overflow-hidden border-r border-border bg-background text-foreground lg:flex"
      >
        <AmbientBackdrop veiled={aboutOpen} media="(min-width: 1024px)" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pt-7 xl:px-8 xl:pt-8">
          <SidebarContent onAboutChange={setAboutOpen} controls={<Controls />} />

          <div className="flex min-h-0 flex-1 flex-col justify-end">
            <SidebarFooter />
          </div>
        </div>
      </aside>

      {/* ── Mobile / tablet: on the home route the panel becomes the page's
          hero section (in flow, above the grid) instead of hiding behind a
          hamburger. Inner pages keep the compact header + drawer below. ── */}
      {isHome ? (
        <section className="dark relative isolate flex min-h-[88svh] flex-col overflow-hidden border-b border-border bg-background text-foreground lg:hidden">
          <AmbientBackdrop veiled={heroAboutOpen} media="(max-width: 1023px)" />
          <div className="relative z-10 flex flex-1 flex-col px-6 pt-6 sm:px-8 sm:pt-7">
            <SidebarContent onAboutChange={setHeroAboutOpen} controls={<Controls />} />
            <div className="flex flex-1 flex-col justify-end pt-12">
              <SidebarFooter />
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* In-flow spacer so page content clears the fixed header. */}
          <div aria-hidden className="h-[72px] md:h-14 lg:hidden" />
      {/* ── Mobile / tablet top header ── */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background lg:hidden"
      >
        <div className="flex h-14 items-center gap-3 px-5 leading-none">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? <XIcon size={18} /> : <ListIcon size={18} />}
          </button>
          <Link
            href="/"
            className="min-w-0 flex-1 tracking-tight text-foreground"
          >
            <TypewriterName className="text-sm" />
          </Link>
          <span className="hidden md:inline [&>span]:!text-foreground/75">
            <LiveClock />
          </span>
          <SoundToggle />
          <ThemeToggle />
        </div>
        <div className="-mt-2 flex h-6 items-center overflow-hidden whitespace-nowrap px-5 md:hidden [&>span]:!text-foreground/75">
          <LiveClock />
        </div>
      </header>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-[72px] z-50 flex w-80 flex-col overflow-y-auto border-r border-border bg-background px-6 py-7 transition-transform duration-200 md:top-14 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
            <SidebarContent onClose={() => setOpen(false)} hideName />
          </aside>
        </>
      )}
    </>
  )
}
