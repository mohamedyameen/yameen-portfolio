'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Phrase = { text: string; color: string }

const PHRASES: Phrase[] = [
  { text: 'Mohamed Yameen',   color: 'text-foreground' },
  { text: 'a.k.a yameen',     color: 'text-sky-600 dark:text-sky-300' },
  { text: 'a.k.a zammy',      color: 'text-pink-600 dark:text-pink-300' },
  { text: 'product designer', color: 'text-cyan-600 dark:text-cyan-300' },
  { text: 'vibe coder',       color: 'text-violet-600 dark:text-violet-300' },
  { text: 'gamer at heart',   color: 'text-rose-600 dark:text-rose-300' },
  { text: 'design × code',    color: 'text-fuchsia-600 dark:text-fuchsia-300' },
  { text: 'based in chennai', color: 'text-amber-600 dark:text-amber-300' },
  { text: 'shipping pixels',  color: 'text-emerald-600 dark:text-emerald-300' },
]

const TYPE_MS       = 70
const ERASE_MS      = 32
const HOLD_FULL_MS  = 1700
const HOLD_EMPTY_MS = 320

export default function TypewriterName({ className }: { className?: string }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [erasing, setErasing] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const target = PHRASES[index].text
    const fullyTyped = !erasing && text === target

    // Hold indefinitely while hovered on a complete phrase
    if (fullyTyped && hovered) return

    if (fullyTyped) {
      const id = setTimeout(() => setErasing(true), HOLD_FULL_MS)
      return () => clearTimeout(id)
    }

    if (erasing && text === '') {
      const id = setTimeout(() => {
        setErasing(false)
        setIndex(i => (i + 1) % PHRASES.length)
      }, HOLD_EMPTY_MS)
      return () => clearTimeout(id)
    }

    const delay = erasing ? ERASE_MS : TYPE_MS
    const id = setTimeout(() => {
      setText(t => (erasing ? t.slice(0, -1) : target.slice(0, t.length + 1)))
    }, delay)
    return () => clearTimeout(id)
  }, [text, erasing, index, hovered])

  const color = PHRASES[index].color

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('font-mono whitespace-nowrap inline-flex items-center leading-none', className)}
    >
      <span className="text-foreground/50 mr-1.5 select-none" aria-hidden>$</span>
      <span className={cn('transition-colors duration-300', color)}>{text}</span>
      <span
        className={cn('ml-0.5 inline-block align-middle tw-cursor transition-colors duration-300', color)}
        style={{ width: '0.55em', height: '0.9em', background: 'currentColor' }}
        aria-hidden
      />

      <style jsx global>{`
        @keyframes tw-cursor-blink {
          0%, 49.999% { opacity: 1; }
          50%, 100%   { opacity: 0; }
        }
        .tw-cursor {
          animation: tw-cursor-blink 1s steps(2, end) infinite;
        }
      `}</style>
    </span>
  )
}
