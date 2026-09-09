'use client'

import Link from 'next/link'
import LiveClock from './LiveClock'
import TypewriterName from './TypewriterName'
import { useWeather, type WeatherCondition } from '@/hooks/useWeather'

const CONDITION_LABEL: Record<WeatherCondition, string> = {
  clear: 'Clear', clouds: 'Cloudy', fog: 'Foggy',
  rain: 'Rain', snow: 'Snow', thunderstorm: 'Thunder',
}

export default function TopNav() {
  const { condition, temperature } = useWeather()

  // pr adds --sb (scrollbar width, set only while a modal locks scroll) so
  // the right-anchored clock doesn't jump when the scrollbar hides.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center py-4 pl-5 pr-[calc(1.25rem+var(--sb,0px))] sm:pl-8 sm:pr-[calc(2rem+var(--sb,0px))] md:pl-10 md:pr-[calc(2.5rem+var(--sb,0px))]">
      <Link
        href="/"
        className="pointer-events-auto text-sm text-white/80 transition-colors hover:text-white"
      >
        <TypewriterName />
      </Link>

      <div className="flex-1" />

      <div className="pointer-events-auto flex flex-col items-end gap-0.5">
        <LiveClock />
        <div className="text-xs tracking-wide text-foreground/60">
          {temperature !== null && condition
            ? <>Chennai · {Math.round(temperature)}° · {CONDITION_LABEL[condition]}</>
            : <span className="opacity-50">Loading weather…</span>}
        </div>
      </div>
    </header>
  )
}
