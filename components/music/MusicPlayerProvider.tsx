'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export const TRACK = {
  src: '/golden-brown.mp3',
  art: '/golden-brown.png',
  title: 'Golden Brown',
  artist: 'The Stranglers',
}

type MusicPlayerContextValue = {
  isPlaying: boolean
  hasStarted: boolean
  dismissed: boolean
  inlineInView: boolean
  setInlineInView: (v: boolean) => void
  toggle: () => void
  play: () => void
  pause: () => void
  close: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null)

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext)
  if (!ctx) throw new Error('useMusicPlayer must be used inside MusicPlayerProvider')
  return ctx
}

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [inlineInView, setInlineInView] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => {
      setIsPlaying(true)
      setHasStarted(true)
      setDismissed(false)
    }
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play().catch(() => {})
    else audio.pause()
  }, [])

  const close = useCallback(() => {
    audioRef.current?.pause()
    setDismissed(true)
  }, [])

  return (
    <MusicPlayerContext.Provider
      value={{
        isPlaying,
        hasStarted,
        dismissed,
        inlineInView,
        setInlineInView,
        toggle,
        play,
        pause,
        close,
      }}
    >
      <audio ref={audioRef} src={TRACK.src} preload="metadata" loop />
      {children}
    </MusicPlayerContext.Provider>
  )
}
