'use client'
import { useEffect, useRef } from 'react'

const COLS = 18
const ROWS = 10
const RADIUS = 110
const MAX_LIFT = 18

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -999, y: -999 })
  const frame = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const src = 'touches' in e ? e.touches[0] : e
      mouse.current = { x: src.clientX - rect.left, y: src.clientY - rect.top }
    }
    const onLeave = () => { mouse.current = { x: -999, y: -999 } }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onMove, { passive: true })
    canvas.addEventListener('mouseleave', onLeave)

    const draw = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
      }

      ctx.clearRect(0, 0, W, H)

      const gapX = W / (COLS + 1)
      const gapY = H / (ROWS + 1)

      for (let r = 1; r <= ROWS; r++) {
        for (let c = 1; c <= COLS; c++) {
          const bx = gapX * c
          const by = gapY * r
          const dx = bx - mouse.current.x
          const dy = by - mouse.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 1 - dist / RADIUS)

          const lift = influence * MAX_LIFT
          const x = bx + (dx / (dist || 1)) * -lift * 0.4
          const y = by + (dy / (dist || 1)) * -lift * 0.4
          const r2 = 1.5 + influence * 3

          // Colour: dim white base → brighter when lifted
          const alpha = 0.15 + influence * 0.7
          ctx.beginPath()
          ctx.arc(x, y, r2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.fill()
        }
      }

      frame.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(frame.current)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
