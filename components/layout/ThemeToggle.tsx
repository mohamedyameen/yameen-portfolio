'use client'
import { useTheme } from 'next-themes'
import { flushSync } from 'react-dom'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSound } from '@/hooks/useSound'

export default function ThemeToggle() {
  const { setTheme } = useTheme()
  const { playHover, playClick } = useSound()
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()

    const obs = new MutationObserver(sync)
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  if (isDark === null) return <div className="h-4 w-4" />

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onMouseEnter={playHover}
          onClick={() => {
            playClick()
            const next = isDark ? 'light' : 'dark'
            const doc = document as Document & {
              startViewTransition?: (cb: () => void) => { ready: Promise<void> }
            }
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            // No View Transitions support (or reduced motion) → plain swap.
            if (!doc.startViewTransition || reduce) {
              setTheme(next)
              return
            }
            const transition = doc.startViewTransition(() => {
              // flushSync forces next-themes to apply the class synchronously
              // so the transition captures the new theme's snapshot.
              flushSync(() => setTheme(next))
            })
            transition.ready.then(() => {
              // Symmetric crossfade: the old theme fades out while the new one
              // fades in, on the same curve — so light→dark and dark→light feel
              // identical (a plain fade-in over an opaque snapshot reads faster
              // going to a lighter theme).
              const timing: KeyframeAnimationOptions = {
                duration: 700,
                // Symmetric ease-in-out (easeInOutCubic): slow start keeps the
                // lighter theme from popping in early, so both directions read
                // at the same, even pace.
                easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
              }
              const root = document.documentElement
              root.animate(
                { opacity: [1, 0] },
                { ...timing, pseudoElement: '::view-transition-old(root)' },
              )
              root.animate(
                { opacity: [0, 1] },
                { ...timing, pseudoElement: '::view-transition-new(root)' },
              )
            })
          }}
          aria-label={label}
          className="grid size-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
        >
          {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}
