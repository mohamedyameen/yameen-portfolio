'use client'
import { useEffect, useState } from 'react'

export default function LiveClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour12: false }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="text-xs tabular-nums text-muted-foreground">
      {time}
    </span>
  )
}
