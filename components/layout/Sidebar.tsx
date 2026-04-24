'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import LiveClock from './LiveClock'
import ThemeToggle from './ThemeToggle'
import SoundToggle from './SoundToggle'
import { useSound } from '@/hooks/useSound'

const navLinks = [
  { href: '/',      label: 'Home',     external: false },
  { href: '/#works', label: 'Work',     external: false },
  { href: '/about', label: 'Info',     external: false },
  { href: 'mailto:mohamedyameen1999@gmail.com',              label: 'Email',    external: true },
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

function SidebarContent({
  pathname,
  activeSection,
  onClose,
  onNavigateToWorks,
  onNavigateHome,
}: {
  pathname: string
  activeSection: 'home' | 'works'
  onClose?: () => void
  onNavigateToWorks: () => void
  onNavigateHome: () => void
}) {
  const { playHover, playClick } = useSound()

  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      <Link
        href="/"
        onMouseEnter={playHover}
        onClick={(e) => {
          e.preventDefault()
          playClick()
          onNavigateHome()
          onClose?.()
        }}
        className="text-base font-medium text-foreground tracking-tight shrink-0"
      >
        Mohamed Yameen
      </Link>

      <nav className="flex flex-col shrink-0">
        {navLinks.map(({ href, label, external }) => {
          const isWorks = href === '/#works'
          const isHome  = href === '/'
          let active = !external && !isWorks && !isHome && pathname === href
          if (pathname === '/') {
            if (isHome  && activeSection === 'home')  active = true
            if (isWorks && activeSection === 'works') active = true
          }
          return (
            <Link
              key={label}
              href={href}
              onMouseEnter={playHover}
              onClick={(e) => {
                playClick()
                if (isWorks) {
                  e.preventDefault()
                  onNavigateToWorks()
                  onClose?.()
                  return
                }
                if (isHome) {
                  e.preventDefault()
                  onNavigateHome()
                  onClose?.()
                  return
                }
                if (!external) onClose?.()
              }}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={cn(
                'text-[15px] py-1 transition-colors duration-150 flex items-center justify-between w-full',
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
    if (pathname !== '/') return

    const update = () => {
      const works = document.getElementById('works')
      if (!works) return
      // "Works visible" = the works section occupies the top portion of viewport
      // Trigger when works section has entered past ~40% of the viewport height
      const trigger = window.innerHeight * 0.4
      const rect = works.getBoundingClientRect()
      const next: 'home' | 'works' = rect.top <= trigger ? 'works' : 'home'
      if (sectionRef.current !== next) {
        sectionRef.current = next
        setActiveSection(next)
      }
    }

    update()

    // rAF loop — fires every frame, catches Lenis-driven scroll reliably
    let raf = 0
    let stopped = false
    const tick = () => {
      update()
      if (!stopped) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Also listen to native events for edge cases
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

  const handleNavigateToWorks = () => {
    setActiveSection('works')
    if (pathname === '/') {
      scrollToWorks()
    } else {
      router.push('/')
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById('works')
        if (el) {
          scrollToWorks()
        } else if (attempts < 20) {
          setTimeout(() => tryScroll(attempts + 1), 50)
        }
      }
      setTimeout(() => tryScroll(), 80)
    }
  }

  const handleNavigateHome = () => {
    setActiveSection('home')
    if (pathname === '/') {
      scrollToTop()
    } else {
      router.push('/')
      setTimeout(() => scrollToTop(), 80)
    }
  }

  return (
    <>
      {/* ── Desktop sidebar (fixed, always visible) ── */}
      <aside
        className="hidden lg:flex flex-col justify-between fixed top-0 left-0 h-screen w-72 z-30 border-r border-border px-6 py-6"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <SidebarContent pathname={pathname} activeSection={activeSection} onNavigateToWorks={handleNavigateToWorks} onNavigateHome={handleNavigateHome} />
        <div className="flex items-center justify-between shrink-0">
          <LiveClock />
          <div className="flex items-center gap-3">
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ── Mobile / tablet top header ── */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 h-14 z-50 border-b border-border flex items-center justify-between px-5"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link href="/" className="text-sm font-medium text-foreground tracking-tight">
            Mohamed Yameen
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <LiveClock />
          <SoundToggle />
          <ThemeToggle />
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
          'lg:hidden fixed top-14 left-0 bottom-0 w-72 z-50 border-r border-border overflow-y-auto px-5 py-6 flex flex-col transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ backgroundColor: 'var(--background)' }}
      >
        <SidebarContent pathname={pathname} onClose={() => setOpen(false)} activeSection={activeSection} onNavigateToWorks={handleNavigateToWorks} onNavigateHome={handleNavigateHome} />
      </aside>
    </>
  )
}
