'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { setTheme } = useTheme()
  const [isDark, setIsDark] = useState<boolean | null>(null)

  // Read the actual applied theme from the <html> class so the icon
  // never drifts from what's rendered on screen.
  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()

    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  if (isDark === null) return <div className="h-4 w-4" />

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {isDark ? <Sun size={13} /> : <Moon size={13} />}
    </button>
  )
}
