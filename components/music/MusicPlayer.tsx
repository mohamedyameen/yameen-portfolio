'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
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
  return (
    <motion.div
      layoutId="music-player"
      transition={MORPH}
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3"
    >
      <PlayerBody />
    </motion.div>
  )
}

export function FloatingMusicPlayer() {
  const pathname = usePathname()
  const { hasStarted, dismissed } = useMusicPlayer()
  const visible = hasStarted && !dismissed && pathname !== '/about'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="floating-player"
          layoutId="music-player"
          transition={MORPH}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
          // Centering via motion x so it doesn't conflict with framer's transform during layoutId animations.
          style={{ x: '-50%', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
          className="fixed bottom-4 left-1/2 z-40 flex w-[min(360px,calc(100vw-2rem))] items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card/90 p-3 shadow-xl backdrop-blur-md lg:left-[calc(50%+9rem)]"
        >
          <PlayerBody withClose />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
