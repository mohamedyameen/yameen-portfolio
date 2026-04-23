'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import LiveClock from './LiveClock'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { href: '/',      label: 'Home',     external: false },
  { href: '/works', label: 'Work',     external: false },
  { href: '/about', label: 'Info',     external: false },
  { href: 'mailto:mohamedyameen1999@gmail.com',              label: 'Email',    external: true },
  { href: 'https://linkedin.com/in/mohamed-yameen-83681315a', label: 'LinkedIn', external: true },
]

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      <Link
        href="/"
        onClick={onClose}
        className="text-sm font-medium text-foreground tracking-tight shrink-0"
      >
        Mohamed Yameen
      </Link>

      <nav className="flex flex-col shrink-0">
        {navLinks.map(({ href, label, external }) => {
          const active = !external && pathname === href
          return (
            <Link
              key={label}
              href={href}
              onClick={!external ? onClose : undefined}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className={cn(
                'text-sm py-0.5 transition-colors duration-150 w-fit',
                active
                  ? 'text-foreground font-semibold'
                  : 'text-foreground/65 hover:text-foreground'
              )}
            >
              {label}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Desktop sidebar (fixed, always visible) ── */}
      <aside
        className="hidden lg:flex flex-col justify-between fixed top-0 left-0 h-screen w-60 z-30 border-r border-border px-5 py-6"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <SidebarContent pathname={pathname} />
        <div className="flex items-center justify-between shrink-0">
          <LiveClock />
          <ThemeToggle />
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
        <SidebarContent pathname={pathname} onClose={() => setOpen(false)} />
      </aside>
    </>
  )
}
