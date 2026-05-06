'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { TRACK, useMusicPlayer } from './MusicPlayerProvider'

const MORPH = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 32,
  mass: 0.9,
}

function ArtBlur() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-[0.12] dark:opacity-[0.18]"
      style={{ backgroundImage: `url(${TRACK.art})`, filter: 'blur(40px)' }}
    />
  )
}

function PlayPauseButton() {
  const { isPlaying, toggle } = useMusicPlayer()
  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? 'Pause' : 'Play'}
      className="relative grid size-8 flex-shrink-0 place-items-center rounded-full text-foreground hover:bg-accent transition-colors"
    >
      {isPlaying ? (
        <Pause size={14} fill="currentColor" />
      ) : (
        <Play size={14} fill="currentColor" className="translate-x-[1px]" />
      )}
    </button>
  )
}

function PlayerBody({ withClose = false }: { withClose?: boolean }) {
  const { close } = useMusicPlayer()
  return (
    <>
      <ArtBlur />
      <div className="relative size-7 flex-shrink-0 grid place-items-center rounded-full bg-background border border-border text-sm">
        <span aria-hidden>🍁</span>
      </div>
      <div className="relative flex min-w-0 flex-1 items-baseline gap-1.5">
        <span className="truncate text-sm font-medium text-foreground">{TRACK.title}</span>
        <span className="truncate text-xs text-muted-foreground">· {TRACK.artist}</span>
      </div>
      <PlayPauseButton />
      {withClose && (
        <button
          onClick={close}
          aria-label="Close player"
          className="relative grid size-8 flex-shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </>
  )
}

export function InlineMusicPlayer() {
  const { setInlineInView, isPlaying, toggle } = useMusicPlayer()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInlineInView(entry.isIntersecting),
      { rootMargin: '-40px 0px 0px 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      setInlineInView(true)
    }
  }, [setInlineInView])

  return (
    <span
      ref={ref}
      className="chip-shine relative inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/[0.08] py-0.5 pl-1 pr-0.5 align-middle select-none shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_6px_20px_-6px_rgba(245,158,11,0.35)] hover:bg-amber-500/[0.12] hover:border-amber-500/60 transition-colors"
    >
      <span aria-hidden className="text-sm leading-none flex-shrink-0 pl-0.5">
        🍁
      </span>
      <span className="text-[13px] font-semibold text-foreground leading-none tracking-tight">
        {TRACK.title}
      </span>
      <button
        onClick={toggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="grid size-5 place-items-center rounded-full bg-foreground text-background hover:bg-amber-500 hover:text-white transition-colors"
      >
        {isPlaying ? (
          <Pause size={9} fill="currentColor" />
        ) : (
          <Play size={9} fill="currentColor" className="translate-x-[0.5px]" />
        )}
      </button>
    </span>
  )
}

export function FloatingMusicPlayer() {
  const pathname = usePathname()
  const { hasStarted, dismissed, inlineInView } = useMusicPlayer()
  const visible =
    hasStarted && !dismissed && (pathname !== '/about' || !inlineInView)
  const onAbout = pathname === '/about'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-player"
          // Only share the morph id off-/about. On /about the trigger is scroll,
          // not a route change — slide it up from the bottom instead of morphing
          // from the inline pill's offscreen rect.
          layoutId={onAbout ? undefined : 'music-player'}
          transition={MORPH}
          initial={onAbout ? { opacity: 0, y: 24 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24, transition: { duration: 0.22, ease: 'easeOut' } }}
          // Centering via motion x so it doesn't conflict with framer's transform during layoutId animations.
          style={{ x: '-50%', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
          className="chip-shine fixed bottom-4 left-1/2 z-40 flex w-[min(360px,calc(100vw-2rem))] items-center gap-3 overflow-hidden rounded-2xl border border-amber-500/40 bg-card/90 p-3 shadow-xl backdrop-blur-md shadow-[0_0_0_1px_rgba(245,158,11,0.06),0_8px_32px_-8px_rgba(245,158,11,0.4)] lg:left-[calc(50%+9rem)]"
        >
          <PlayerBody withClose />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
