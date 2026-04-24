'use client'
import { useCallback, useEffect, useState } from 'react'

let audioCtx: AudioContext | null = null
let enabled = true
let initialized = false
let unlocked = false
let lastHover = 0
const listeners = new Set<() => void>()

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return null
    audioCtx = new AC()
  }
  return audioCtx
}

function unlockAudio() {
  if (unlocked) return
  const ctx = getCtx()
  if (!ctx) return
  ctx.resume().then(() => {
    if (ctx.state === 'running') unlocked = true
  }).catch(() => {})
  // Prime the graph with a silent tone so the first real tone plays instantly.
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.01)
  } catch {}
}

function attachUnlockListeners() {
  if (typeof window === 'undefined') return
  const handler = () => {
    unlockAudio()
    if (unlocked) {
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('touchstart', handler)
    }
  }
  window.addEventListener('pointerdown', handler)
  window.addEventListener('keydown', handler)
  window.addEventListener('touchstart', handler, { passive: true })
}

function notify() {
  listeners.forEach((fn) => fn())
}

function loadEnabled(): boolean {
  if (typeof window === 'undefined') return true
  const saved = window.localStorage.getItem('ui-sound')
  return saved !== 'off'
}

function ensureInitialized() {
  if (initialized) return
  initialized = true
  enabled = loadEnabled()
  attachUnlockListeners()
}

function playTone(freq: number, duration: number, peak = 0.05) {
  if (!enabled) return
  const ctx = getCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq

  const t = ctx.currentTime
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(peak, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)

  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export function useSound() {
  const [, force] = useState(0)

  useEffect(() => {
    ensureInitialized()
    const fn = () => force((n) => n + 1)
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  }, [])

  const playHover = useCallback(() => {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    if (now - lastHover < 80) return
    lastHover = now
    playTone(920, 0.09, 0.2)
  }, [])

  const playClick = useCallback(() => {
    playTone(520, 0.16, 0.32)
  }, [])

  const toggle = useCallback(() => {
    enabled = !enabled
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ui-sound', enabled ? 'on' : 'off')
    }
    if (enabled) playTone(720, 0.14, 0.32)
    notify()
  }, [])

  return { playHover, playClick, enabled, toggle }
}
