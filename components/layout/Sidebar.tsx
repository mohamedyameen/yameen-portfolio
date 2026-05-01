'use client'
import { useState, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import LiveClock from './LiveClock'
import SidebarAmbient from './SidebarAmbient'
import ThemeToggle from './ThemeToggle'
import SoundToggle from './SoundToggle'
import TypewriterName from './TypewriterName'
import { useSound } from '@/hooks/useSound'

const navLinks = [
  { href: '/',       label: 'Home',     external: false },
  { href: '/#works', label: 'Work',     external: false },
  { href: '/about',  label: 'Info',     external: false },
  { href: 'mailto:mohamedyameen1999@gmail.com',               label: 'Email',    external: true },
  { href: 'https://linkedin.com/in/mohamed-yameen-83681315a', label: 'LinkedIn', external: true },
]

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function scrollToWorks() {
  const target = document.getElementById('works')
  if (!target) return
  const offset = window.innerWidth < 1024 ? -56 : 0
  const lenis = globalThis.lenis
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.2, easing: easeOutCubic })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function scrollToTop() {
  const lenis = globalThis.lenis
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2, easing: easeOutCubic })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

type NavTarget = 'home' | 'works' | 'about'

const TARGET_BY_HREF: Record<string, NavTarget> = {
  '/':       'home',
  '/#works': 'works',
  '/about':  'about',
}

function SidebarContent({
  pathname,
  activeSection,
  onClose,
  onNavigate,
  controls,
  hideName,
}: {
  pathname: string
  activeSection: 'home' | 'works'
  onClose?: () => void
  onNavigate: (target: NavTarget) => void
  controls?: ReactNode
  hideName?: boolean
}) {
  const { playHover, playClick } = useSound()

  return (
    <div className="flex flex-col gap-6 shrink-0">
      {!hideName && (
        <div className="flex items-center gap-3 leading-none">
          <Link
            href="/"
            onMouseEnter={playHover}
            onClick={(e) => {
              e.preventDefault()
              playClick()
              onNavigate('home')
              onClose?.()
            }}
            className="flex-1 min-w-0 text-foreground tracking-tight"
          >
            <TypewriterName className="text-sm" />
          </Link>
          {controls}
        </div>
      )}

      <nav className="flex flex-col">
        {navLinks.map(({ href, label, external }) => {
          const target = TARGET_BY_HREF[href]
          // Active state: on `/` we use the scroll-derived activeSection for
          // home/works. Otherwise pathname match.
          let active = false
          if (target) {
            if (pathname === '/') {
              active = (target === 'home'  && activeSection === 'home') ||
                       (target === 'works' && activeSection === 'works')
            } else if (target === 'about') {
              active = pathname === '/about'
            }
          }

          return (
            <Link
              key={label}
              href={href}
              onMouseEnter={playHover}
              onClick={(e) => {
                playClick()
                if (target) {
                  e.preventDefault()
                  onNavigate(target)
                  onClose?.()
                  return
                }
                if (!external) onClose?.()
              }}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={cn(
                'text-sm py-1 transition-colors duration-150 flex items-center justify-between w-full',
                active
                  ? 'text-foreground font-semibold'
                  : 'text-foreground/65 hover:text-foreground'
              )}
            >
              {label}
              {external && <ArrowUpRight size={16} className="opacity-50" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<'home' | 'works'>('home')
  const sectionRef = useRef<'home' | 'works'>('home')

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (pathname !== '/') return

    const update = () => {
      const works = document.getElementById('works')
      if (!works) return
      const trigger = window.innerHeight * 0.4
      const rect = works.getBoundingClientRect()
      const next: 'home' | 'works' = rect.top <= trigger ? 'works' : 'home'
      if (sectionRef.current !== next) {
        sectionRef.current = next
        setActiveSection(next)
      }
    }

    update()

    let raf = 0
    let stopped = false
    const tick = () => {
      update()
      if (!stopped) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navigate = (target: NavTarget) => {
    const path = target === 'about' ? '/about' : '/'
    if (target === 'home')  setActiveSection('home')
    if (target === 'works') setActiveSection('works')

    const onArrived = () => {
      if (target === 'works') {
        // Wait for the #works section to mount, then smooth-scroll to it.
        const tryScroll = (attempts = 0) => {
          const el = document.getElementById('works')
          if (el) scrollToWorks()
          else if (attempts < 20) setTimeout(() => tryScroll(attempts + 1), 50)
        }
        tryScroll()
      } else {
        scrollToTop()
      }
    }

    if (pathname === path) {
      onArrived()
    } else {
      router.push(path)
      setTimeout(onArrived, 80)
    }
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-72 z-30 border-r border-border px-6 pt-6"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Name + controls row */}
        <SidebarContent
          pathname={pathname}
          activeSection={activeSection}
          onNavigate={navigate}
          controls={
            <div className="flex items-center gap-3">
              <SoundToggle />
              <ThemeToggle />
            </div>
          }
        />

        {/* Ambient pushed to bottom — no gap below since pb is removed from aside */}
        <div className="flex-1 flex flex-col justify-end min-h-0">
          <SidebarAmbient footer={<LiveClock />} />
        </div>
      </aside>

      {/* ── Mobile / tablet top header ── */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-50 border-b border-border"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Main row */}
        <div className="h-14 flex items-center gap-3 px-5 leading-none">
          <button
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate('home')
            }}
            className="flex-1 min-w-0 text-foreground tracking-tight"
          >
            <TypewriterName className="text-sm" />
          </Link>
          {/* tablet only — keep clock inline */}
          <span className="hidden md:inline [&>span]:!text-foreground/75">
            <LiveClock />
          </span>
          <SoundToggle />
          <ThemeToggle />
        </div>
        {/* Sub-header: clock — mobile only */}
        <div className="md:hidden h-6 px-5 -mt-2 flex items-center whitespace-nowrap overflow-hidden [&>span]:!text-foreground/75">
          <LiveClock />
        </div>
      </header>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          'lg:hidden fixed top-[72px] md:top-14 left-0 bottom-0 w-72 z-50 border-r border-border overflow-y-auto px-5 py-6 flex flex-col transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: 'var(--background)' }}
      >
        <SidebarContent
          pathname={pathname}
          onClose={() => setOpen(false)}
          activeSection={activeSection}
          onNavigate={navigate}
          hideName
        />
      </aside>
    </>
  )
}
