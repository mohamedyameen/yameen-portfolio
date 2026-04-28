'use client'
import { useEffect, useRef, useCallback } from 'react'

// ── constants ────────────────────────────────────────────────────
const GRAVITY      = 0.28
const THRUST       = -5.0
const GATE_SPEED   = 3.2
const GATE_GAP     = 140
const GATE_INTERVAL= 115  // frames between gates
const STAR_COUNT   = 100

type State = 'idle' | 'playing' | 'dead'

interface Star  { x: number; y: number; r: number; speed: number; alpha: number }
interface Gate  { x: number; top: number; scored?: boolean }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }

// ── helpers ──────────────────────────────────────────────────────
function makeStars(W: number, H: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.4 + 0.3,
    speed: Math.random() * 1.2 + 0.3,
    alpha: Math.random() * 0.6 + 0.2,
  }))
}

function makeSparks(x: number, y: number): Spark[] {
  return Array.from({ length: 22 }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 4 + 1
    const life  = Math.random() * 30 + 20
    return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, maxLife: life }
  })
}

// ── component ─────────────────────────────────────────────────────
export default function SpaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const run = useCallback(() => {
    if (!canvasRef.current) return
    const canvas: HTMLCanvasElement = canvasRef.current
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0
    let state: State = 'idle'
    let raf = 0
    let frame = 0

    // player
    let py = 0, vy = 0

    // game objects
    let stars: Star[]     = []
    let gates: Gate[]     = []
    let sparks: Spark[]   = []
    let score = 0
    let best  = 0

    // ── audio ──────────────────────────────────────────────────────
    let audioCtx: AudioContext | null = null
    const getCtx = () => {
      if (!audioCtx) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioCtx = new AC()
      }
      if (audioCtx.state === 'suspended') audioCtx.resume()
      return audioCtx
    }

    function playThrust() {
      const ac = getCtx()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(380, ac.currentTime)
      osc.frequency.exponentialRampToValueAtTime(210, ac.currentTime + 0.08)
      gain.gain.setValueAtTime(0.12, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12)
      osc.connect(gain).connect(ac.destination)
      osc.start()
      osc.stop(ac.currentTime + 0.13)
    }

    function playScore() {
      const ac = getCtx()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(720, ac.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1180, ac.currentTime + 0.1)
      gain.gain.setValueAtTime(0.08, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.16)
      osc.connect(gain).connect(ac.destination)
      osc.start()
      osc.stop(ac.currentTime + 0.18)
    }

    function playDeath() {
      const ac = getCtx()
      // noise burst (explosion)
      const size = Math.floor(ac.sampleRate * 0.55)
      const buf = ac.createBuffer(1, size, ac.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2)
      const noise = ac.createBufferSource()
      noise.buffer = buf
      const filter = ac.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1400, ac.currentTime)
      filter.frequency.exponentialRampToValueAtTime(90, ac.currentTime + 0.5)
      const nGain = ac.createGain()
      nGain.gain.setValueAtTime(0.28, ac.currentTime)
      nGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55)
      noise.connect(filter).connect(nGain).connect(ac.destination)
      noise.start()

      // low rumble tone
      const osc = ac.createOscillator()
      const oGain = ac.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(160, ac.currentTime)
      osc.frequency.exponentialRampToValueAtTime(38, ac.currentTime + 0.45)
      oGain.gain.setValueAtTime(0.18, ac.currentTime)
      oGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.45)
      osc.connect(oGain).connect(ac.destination)
      osc.start()
      osc.stop(ac.currentTime + 0.5)
    }

    function syncSize() {
      const nextW = canvas.offsetWidth
      const nextH = canvas.offsetHeight
      if (nextW === W && nextH === H) return false
      const prevW = W, prevH = H
      const dpr = window.devicePixelRatio || 1
      W = nextW
      H = nextH
      canvas.width  = Math.max(1, Math.floor(W * dpr))
      canvas.height = Math.max(1, Math.floor(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Keep player vertically proportional so they don't snap on resize
      if (prevH > 0 && H > 0) py = (py / prevH) * H
      else py = H / 2
      // Rescale gates' x position so the field doesn't jump horizontally
      if (prevW > 0 && W > 0 && prevW !== W) {
        const sx = W / prevW
        gates.forEach(g => { g.x *= sx })
      }
      // Rebuild stars to match the new dimensions
      stars = makeStars(W, H)
      return true
    }

    function init() {
      syncSize()
      py = H / 2
      vy = 0
      gates  = []
      sparks = []
      stars  = makeStars(W, H)
      score  = 0
      frame  = 0
    }

    // ── input ──────────────────────────────────────────────────────
    function activate() {
      if (state === 'idle') {
        state = 'playing'
        vy = THRUST
        playThrust()
      } else if (state === 'playing') {
        vy = THRUST
        playThrust()
      } else if (state === 'dead') {
        state = 'idle'
        init()
      }
    }

    const onKey = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); activate() } }
    const onClick = () => activate()
    window.addEventListener('keydown', onKey)
    canvas.addEventListener('click', onClick)

    // ── draw helpers ───────────────────────────────────────────────
    function drawShip(x: number, y: number, alpha = 1) {
      ctx.save()
      ctx.translate(x, y)
      // slight tilt based on velocity
      const tilt = Math.max(-0.5, Math.min(0.5, vy * 0.045))
      ctx.rotate(tilt)
      ctx.globalAlpha = alpha

      // engine glow
      const grd = ctx.createRadialGradient(-8, 0, 0, -8, 0, 14)
      grd.addColorStop(0, 'rgba(120,200,255,0.5)')
      grd.addColorStop(1, 'rgba(120,200,255,0)')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.ellipse(-10, 0, 14, 7, 0, 0, Math.PI * 2)
      ctx.fill()

      // fuselage
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.moveTo(14, 0)
      ctx.lineTo(-10, -7)
      ctx.lineTo(-6, 0)
      ctx.lineTo(-10, 7)
      ctx.closePath()
      ctx.fill()

      // cockpit
      ctx.fillStyle = 'rgba(100,220,255,0.8)'
      ctx.beginPath()
      ctx.ellipse(4, -1, 5, 4, 0.3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    function drawGate(gate: Gate) {
      const W2 = 22
      const col = 'rgba(255,255,255,0.12)'
      const stroke = 'rgba(255,255,255,0.35)'

      // top pillar
      ctx.fillStyle = col
      ctx.fillRect(gate.x, 0, W2, gate.top)
      ctx.strokeStyle = stroke
      ctx.lineWidth = 1
      ctx.strokeRect(gate.x, 0, W2, gate.top)

      // bottom pillar
      const bot = gate.top + GATE_GAP
      ctx.fillStyle = col
      ctx.fillRect(gate.x, bot, W2, H - bot)
      ctx.strokeStyle = stroke
      ctx.strokeRect(gate.x, bot, W2, H - bot)

      // edge glow lines
      ctx.strokeStyle = 'rgba(120,200,255,0.5)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(gate.x + W2, gate.top)
      ctx.lineTo(gate.x + W2, bot)
      ctx.stroke()
    }

    function drawStars(scroll: number) {
      stars.forEach(s => {
        const x = ((s.x - scroll * s.speed * 0.4) % W + W) % W
        ctx.globalAlpha = s.alpha
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    function drawSparks() {
      sparks.forEach(s => {
        ctx.globalAlpha = s.life / s.maxLife
        ctx.fillStyle = `hsl(${190 + Math.random() * 40},100%,75%)`
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    const MONO = `ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`

    function drawText(text: string, y: number, size: number, alpha = 1, bold = false) {
      ctx.globalAlpha = alpha
      ctx.font = `${bold ? 'bold ' : ''}${size}px ${MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(text, W / 2, y)
      ctx.globalAlpha = 1
    }

    // ── main loop ──────────────────────────────────────────────────
    let starScroll = 0

    function tick() {
      raf = requestAnimationFrame(tick)

      // background
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, W, H)

      starScroll++
      drawStars(starScroll)

      // ── idle ──
      if (state === 'idle') {
        drawShip(W * 0.28, H / 2)

        ctx.globalAlpha = 0.85
        ctx.font = `bold 15px ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.fillText('press space or tap to play', W / 2, H / 2 + 48)
        ctx.globalAlpha = 1

        if (best > 0) {
          ctx.globalAlpha = 0.3
          ctx.font = `bold 12px ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`
          ctx.fillText(`best  ${best}`, W / 2, H / 2 + 68)
          ctx.globalAlpha = 1
        }
        return
      }

      // ── dead ──
      if (state === 'dead') {
        sparks = sparks.filter(s => s.life > 0)
        sparks.forEach(s => { s.x += s.vx; s.y += s.vy; s.vy += 0.15; s.life-- })
        drawSparks()

        drawText('DESTROYED', H / 2 - 90, 12, 0.75, true)

        // SCORE label
        ctx.globalAlpha = 0.45
        ctx.font = `bold 11px ${MONO}`
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.fillText('SCORE', W / 2, H / 2 - 46)
        ctx.globalAlpha = 1

        // big number
        ctx.font = `bold 72px ${MONO}`
        ctx.fillStyle = '#fff'
        ctx.globalAlpha = 1
        ctx.fillText(`${score}`, W / 2, H / 2 + 22)

        // best
        if (best > 0 && score >= best) {
          drawText('✦ new best', H / 2 + 58, 12, 0.8, true)
        } else if (best > 0) {
          drawText(`best  ${best}`, H / 2 + 58, 12, 0.45, true)
        }

        drawText('tap to try again', H / 2 + 90, 12, 0.4, true)
        return
      }

      // ── playing ──
      frame++

      // spawn gate
      if (frame % GATE_INTERVAL === 0) {
        const minTop = 40
        const maxTop = H - GATE_GAP - 40
        gates.push({ x: W, top: minTop + Math.random() * (maxTop - minTop) })
      }

      // physics
      vy += GRAVITY
      py += vy

      // move + cull gates
      gates.forEach(g => { g.x -= GATE_SPEED })
      gates = gates.filter(g => g.x > -30)

      // score — increment each time a gate's right edge clears the player
      const PX = W * 0.28
      gates.forEach(g => {
        if (!g.scored && g.x + 22 < PX) {
          g.scored = true
          score++
          playScore()
        }
      })

      // draw gates
      gates.forEach(drawGate)

      // collision
      const HITW = 10
      const crashed =
        py - HITW < 0 ||
        py + HITW > H ||
        gates.some(g =>
          PX + HITW > g.x &&
          PX - HITW < g.x + 22 &&
          (py - HITW < g.top || py + HITW > g.top + GATE_GAP)
        )

      if (crashed) {
        sparks = makeSparks(PX, py)
        if (score > best) best = score
        state = 'dead'
        playDeath()
        return
      }

      drawShip(PX, py)

      // live score — large, centered, top
      ctx.globalAlpha = 0.9
      ctx.font = `bold 28px ${MONO}`
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(`${score}`, W / 2, 38)
      ctx.globalAlpha = 1
    }

    init()
    raf = requestAnimationFrame(tick)

    const ro = new ResizeObserver(() => { syncSize() })
    ro.observe(canvas)

    const onWindowResize = () => { syncSize() }
    window.addEventListener('resize', onWindowResize)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('click', onClick)
      audioCtx?.close()
    }
  }, [])

  useEffect(() => {
    const cleanup = run()
    return cleanup
  }, [run])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ display: 'block' }}
    />
  )
}
