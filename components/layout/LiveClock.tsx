'use client'
import { useEffect, useState } from 'react'

function getCatchyTime(): string {
  const now = new Date()
  const hour = now.getHours()
  const min = now.getMinutes().toString().padStart(2, '0')
  const period = hour < 12 ? 'am' : 'pm'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const clock = `${hour12}:${min} ${period}`

  let label: string
  if (hour >= 0 && hour < 4)   label = `deep night in India`
  else if (hour < 5)            label = `almost dawn in India`
  else if (hour < 6)            label = `early bird hours, India`
  else if (hour < 8)            label = `just woke up in India`
  else if (hour < 10)           label = `morning chai time, India`
  else if (hour < 12)           label = `mid-morning in India`
  else if (hour === 12)         label = `noon in India`
  else if (hour < 14)           label = `post-lunch lull, India`
  else if (hour < 17)           label = `afternoon in India`
  else if (hour < 19)           label = `golden hour in India`
  else if (hour < 21)           label = `evening in India`
  else if (hour < 23)           label = `winding down in India`
  else                          label = `midnight in India`

  return `${label} · ${clock}`
}

export default function LiveClock() {
  const [text, setText] = useState('')

  useEffect(() => {
    const tick = () => setText(getCatchyTime())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="text-xs text-muted-foreground">
      {text}
    </span>
  )
}
