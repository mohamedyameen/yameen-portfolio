'use client'
import { useEffect, useState } from 'react'

export type WeatherCondition = 'clear' | 'clouds' | 'fog' | 'rain' | 'thunderstorm' | 'snow'

const CACHE_KEY = 'yameen-weather-v2'
const TTL_MS = 15 * 60 * 1000 // 15 minutes

type CacheShape = { at: number; condition: WeatherCondition; temperature: number }

const VALID_CONDITIONS = new Set<WeatherCondition>([
  'clear', 'clouds', 'fog', 'rain', 'snow', 'thunderstorm',
])

function readCache(): CacheShape | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheShape
    if (Date.now() - parsed.at > TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(data: CacheShape) {
  if (typeof window === 'undefined') return
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch {}
}

function getDevOverride(): WeatherCondition | null {
  if (typeof window === 'undefined') return null
  const param = new URLSearchParams(window.location.search).get('weather')
  return param && VALID_CONDITIONS.has(param as WeatherCondition)
    ? (param as WeatherCondition)
    : null
}

export function useWeather() {
  const [condition, setCondition]   = useState<WeatherCondition | null>(null)
  const [temperature, setTemperature] = useState<number | null>(null)

  useEffect(() => {
    const override = getDevOverride()
    if (override) {
      setCondition(override)
      setTemperature(35)
      return
    }

    let cancelled = false

    const cached = readCache()
    if (cached) {
      setCondition(cached.condition)
      setTemperature(cached.temperature)
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather')
        if (!res.ok) return
        const json = await res.json()
        if (cancelled) return
        const next = json?.condition as WeatherCondition | undefined
        if (next && VALID_CONDITIONS.has(next)) setCondition(next)
        if (typeof json?.temperature === 'number') setTemperature(json.temperature)
        if (next && VALID_CONDITIONS.has(next)) {
          writeCache({
            at: Date.now(),
            condition: next,
            temperature: typeof json?.temperature === 'number' ? json.temperature : 0,
          })
        }
      } catch {
        /* offline or blocked — silently ignore */
      }
    }

    if (!cached) fetchWeather()
    const id = setInterval(fetchWeather, TTL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  return { condition, temperature }
}
