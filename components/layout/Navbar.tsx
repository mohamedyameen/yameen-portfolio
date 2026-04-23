'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',        label: 'Home'    },
  { href: '/works',   label: 'Works'   },
  { href: '/profile', label: 'Profile' },
  { href: '/resume',  label: 'Resume'  },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50
      border-b border-[var(--border)]
      bg-[var(--background)]/70 backdrop-blur-xl">

      <nav className="max-w-6xl mx-auto px-6 h-16
        flex items-center justify-between">

        {/* Logo */}
        <Link href="/"
          className="font-mono font-bold text-lg tracking-tight text-[var(--foreground)]">
          yameen<span style={{ color: 'var(--accent)' }}>.</span>
        </Link>

        {/* Links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-white/5"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center gap-2">
          <a
            href="/contact"
            className="hidden md:flex items-center px-4 py-2 rounded-lg text-sm 
              font-medium border border-[var(--border)] text-[var(--foreground)]
              hover:border-[var(--accent)]/50 transition-colors"
          >
            Hire Me
          </a>
          <ThemeToggle />
        </div>

      </nav>
    </header>
  )
}