'use client'
import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { useWeather, type WeatherCondition } from '@/hooks/useWeather'

/* ── Dense dot field config ── */
const COLS    = 48
const ROWS    = 40
const SPACING = 6
const RADIUS_BG  = 1.0
const RADIUS_LIT = 1.5
const W = COLS * SPACING  // 288
const H = ROWS * SPACING  // 240

type Cell = [number, number]
const inGrid = ([c, r]: Cell) => c >= 0 && c < COLS && r >= 0 && r < ROWS
const key = (c: number, r: number) => `${c},${r}`

const CONDITION_LABEL: Record<WeatherCondition, string> = {
  clear: 'Clear', clouds: 'Cloudy', fog: 'Foggy',
  rain: 'Rain', snow: 'Snow', thunderstorm: 'Thunder',
}

function sunCluster(cx: number, cy: number): Cell[] {
  const cells: Cell[] = []
  // Circular body — Euclidean radius ~2.2
  for (let dr = -2; dr <= 2; dr++)
    for (let dc = -2; dc <= 2; dc++)
      if (dc * dc + dr * dr <= 5) cells.push([cx + dc, cy + dr])
  // Cardinal rays — 1 connector + 1 tip per direction
  cells.push(
    [cx,   cy-3], [cx,   cy-4],
    [cx,   cy+3], [cx,   cy+4],
    [cx-3, cy  ], [cx-4, cy  ],
    [cx+3, cy  ], [cx+4, cy  ],
  )
  // Diagonal tips
  cells.push(
    [cx-2, cy-3], [cx+2, cy-3],
    [cx-2, cy+3], [cx+2, cy+3],
  )
  return cells.filter(inGrid)
}

/* Circular 7-cell-diameter lunar disc, built by Euclidean distance from centre */
const MOON_R = 3
const MOON_DISC: Array<[number, number]> = (() => {
  const cells: Array<[number, number]> = []
  for (let dy = -MOON_R; dy <= MOON_R; dy++) {
    for (let dx = -MOON_R; dx <= MOON_R; dx++) {
      if (dx * dx + dy * dy <= MOON_R * MOON_R) cells.push([dx, dy])
    }
  }
  return cells
})()

/** Moon phase 0..1: 0 = new, 0.25 = first quarter, 0.5 = full,
 *  0.75 = last quarter, 1 = new. Anchored to a known new moon
 *  (2000-01-06 18:14 UTC) and stepped by the synodic month. */
function getMoonPhase(date: Date): number {
  const SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000
  const REF_MS = Date.UTC(2000, 0, 6, 18, 14)
  const elapsed = ((date.getTime() - REF_MS) % SYNODIC_MS + SYNODIC_MS) % SYNODIC_MS
  return elapsed / SYNODIC_MS
}

/* Halo ring — true Euclidean ring at radius 4.2±0.5 around the disc.
   Computed, not hand-picked, so it stays circular, never star-shaped. */
const MOON_HALO: Array<[number, number]> = (() => {
  const out: Array<[number, number]> = []
  for (let dy = -5; dy <= 5; dy++)
    for (let dx = -5; dx <= 5; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d >= 3.8 && d <= 4.6) out.push([dx, dy])
    }
  return out
})()

/* Fixed star field — seeded positions in the sky band (rows 2–16).
   Deterministic so they don't jump on re-render. */
const STAR_CELLS: Cell[] = (() => {
  const stars: Cell[] = []
  let s = 0xdeadbeef >>> 0
  const rng = () => { s = Math.imul(s, 1664525) + 1013904223 >>> 0; return s / 0xffffffff }
  for (let i = 0; i < 22; i++) {
    const c = 1 + Math.floor(rng() * (COLS - 2))
    const r = 2 + Math.floor(rng() * 14)
    stars.push([c, r])
  }
  return stars
})()

type MoonParts = {
  lit: Cell[]   // only the lit portion — no dark circle, no halo
}

/* Only returns lit cells — no shadow, no halo.
   The unlit half simply falls back to the background dot grid,
   so the moon reads as a clean crescent/disc without a dark ring. */
function moonParts(cx: number, cy: number, phase: number): MoonParts {
  if (phase < 0.02 || phase > 0.98) return { lit: [] }

  const lit: Cell[] = []
  for (const [dx, dy] of MOON_DISC) {
    const halfW = Math.sqrt(Math.max(0, MOON_R * MOON_R - dy * dy))
    const isLit = phase < 0.5
      ? dx >= (1 - 4 * phase) * halfW
      : dx <= (3 - 4 * phase) * halfW
    const cell: Cell = [cx + dx, cy + dy]
    if (inGrid(cell) && isLit) lit.push(cell)
  }
  return { lit }
}

function cloudCluster(cx: number, cy: number): Cell[] {
  return ([
    [cx+2, cy-2], [cx+3, cy-2], [cx+4, cy-2], [cx+5, cy-2], [cx+6, cy-2],
    [cx+1, cy-1], [cx+2, cy-1], [cx+3, cy-1], [cx+4, cy-1], [cx+5, cy-1], [cx+6, cy-1], [cx+7, cy-1],
    [cx,   cy  ], [cx+1, cy  ], [cx+2, cy  ], [cx+3, cy  ], [cx+4, cy  ], [cx+5, cy  ], [cx+6, cy  ], [cx+7, cy  ], [cx+8, cy],
  ] as Cell[]).filter(inGrid)
}

const CLOUD_STEPS  = 80
const CLOUD_Y      = 10
const CLOUD_Y2     = 19   // second cloud, below the first

function getCloudX(phase: number): number {
  return Math.round(4 + ((Math.sin(phase / CLOUD_STEPS * Math.PI * 2) + 1) / 2) * 32)
}

// Second cloud drifts in the opposite direction — negative sine
function getCloud2X(phase: number): number {
  return Math.round(2 + ((-Math.sin(phase / CLOUD_STEPS * Math.PI * 2) + 1) / 2) * 28)
}

/* Seeded LCG — deterministic randomness per cloudPhase so positions are
   stable within a step but reshuffle naturally as clouds drift. */
function makeLCG(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0
    return s / 0xffffffff
  }
}

function randomDrops(cx: number, cy: number, count: number, rand: () => number): [number, number][] {
  return Array.from({ length: count }, () => {
    const c = cx + Math.floor(rand() * 9)
    const r = cy + 3 + Math.floor(rand() * 8)
    return [c, r] as [number, number]
  }).filter(([c, r]) => c >= 0 && c < COLS && r >= 0 && r < ROWS)
}

function randomBolt(cx: number, cy: number, rand: () => number): [number, number][] {
  const cells: [number, number][] = []
  let x = cx + 3 + Math.floor(rand() * 3)
  for (let i = 0; i < 6; i++) {
    if (x >= 0 && x < COLS && cy + 3 + i < ROWS) cells.push([x, cy + 3 + i])
    x = Math.max(cx, Math.min(cx + 7, x + (rand() > 0.5 ? 1 : -1)))
  }
  return cells
}

function snowflakeCluster(cx: number, cy: number): [number, number][] {
  return ([
    [cx-1, cy], [cx+1, cy],   // horizontal tips
    [cx, cy-1], [cx, cy+1],   // vertical tips
  ] as [number, number][]).filter(([c, r]) => c >= 0 && c < COLS && r >= 0 && r < ROWS)
}

type FogDot = { c: number; r: number; radius: number }

/* A single mist ribbon: dots taper at both ends and drift along a gentle wave,
   so it reads as a soft streak rather than a line of uniform dots. */
function fogRibbon(startC: number, baseR: number, length: number, seed: number): FogDot[] {
  const dots: FogDot[] = []
  for (let i = 0; i < length; i++) {
    const c = startC + i
    if (c < 0 || c >= COLS) continue
    const t = length > 1 ? i / (length - 1) : 0.5  // 0..1
    const envelope = Math.sin(t * Math.PI)          // 0..1..0, fades at both ends
    if (envelope < 0.12) continue
    const r = baseR + Math.round(Math.sin((i + seed) * 0.45) * 0.5)
    if (r < 0 || r >= ROWS) continue
    dots.push({ c, r, radius: 0.5 + envelope * 1.7 })
  }
  return dots
}

// Five sparse mist ribbons across both sides — minimal but clearly fog.
const FOG_RIBBON_FAR:      FogDot[] = fogRibbon(6,  15, 16, 0)
const FOG_RIBBON_MID:      FogDot[] = fogRibbon(2,  22, 22, 4)
const FOG_RIBBON_NEAR:     FogDot[] = fogRibbon(10, 29, 14, 9)
const FOG_RIBBON_RIGHT_HI: FogDot[] = fogRibbon(28, 18, 16, 2)
const FOG_RIBBON_RIGHT_LO: FogDot[] = fogRibbon(24, 26, 20, 7)

/* Random fog puffs — scattered in the lower atmospheric band.
   Reshuffle each cloud step for subtle organic variation. */
function randomFogPuffs(count: number, rowMin: number, rowMax: number, rand: () => number): FogDot[] {
  return Array.from({ length: count }, () => {
    const c = Math.floor(rand() * COLS)
    const r = rowMin + Math.floor(rand() * (rowMax - rowMin + 1))
    const radius = 0.4 + rand() * 1.4
    return { c, r, radius }
  }).filter(({ c, r }) => c >= 0 && c < COLS && r >= 0 && r < ROWS)
}

type SkyBody =
  | { kind: 'sun'; cells: Cell[] }
  | { kind: 'moon'; parts: MoonParts }

function getSkyBody(date: Date): SkyBody {
  const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600
  if (h >= 6 && h < 19) {
    const t  = (h - 6) / 13
    const cx = Math.round(16 + t * 28)
    // arc peaks at row 9 (noon) — kept clear of the top fade zone
    const cy = Math.round(16 - Math.sin(t * Math.PI) * 7)
    return { kind: 'sun', cells: sunCluster(cx, cy) }
  }
  const nh = h < 6 ? h + 24 : h
  const t  = (nh - 19) / 11
  const cx = Math.round(5 + t * 38)
  const cy = Math.round(16 - Math.sin(t * Math.PI) * 7)
  const phase = getMoonPhase(date)
  return { kind: 'moon', parts: moonParts(cx, cy, phase) }
}

type Role = 'bg' | 'sun' | 'moon' | 'cloud' | 'star'

const ROLE_CLASS: Record<Role, string> = {
  bg:    'text-foreground/[0.26]',
  sun:   'text-amber-600 dark:text-amber-200',
  moon:  'text-slate-600 dark:text-white',
  cloud: 'text-slate-600 dark:text-slate-200',
  star:  'text-slate-500 dark:text-white/80',
}

export default function SidebarAmbient({ footer }: { footer?: ReactNode }) {
  const [now, setNow] = useState<Date | null>(null)
  const [cloudPhase, setCloudPhase] = useState(0)
  const { condition, temperature } = useWeather()

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 5_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setCloudPhase(p => (p + 1) % CLOUD_STEPS), 800)
    return () => clearInterval(id)
  }, [])

  const cond       = condition ?? 'clear'
  const isNight    = now ? (now.getHours() >= 19 || now.getHours() < 6) : false
  const showSky    = cond === 'clear' || cond === 'clouds' || cond === 'fog'
  const showStars  = isNight && cond === 'clear'
  const showCloud  = cond === 'clouds' || cond === 'rain' || cond === 'snow' || cond === 'thunderstorm'
  const showRain  = cond === 'rain'
  const showSnow  = cond === 'snow'
  const showBolt  = cond === 'thunderstorm'
  const showFog   = cond === 'fog'

  const skyBody = now && showSky ? getSkyBody(now) : null
  const cloudX  = getCloudX(cloudPhase)
  const cloud2X = getCloud2X(cloudPhase)

  const roles = new Map<string, Role>()

  // Layer order: stars → sun/moon → clouds (clouds always on top, occlude everything)
  if (showStars)
    STAR_CELLS.forEach(([c, r]) => roles.set(key(c, r), 'star'))

  if (skyBody?.kind === 'sun')
    skyBody.cells.forEach(([c, r]) => roles.set(key(c, r), 'sun'))

  if (skyBody?.kind === 'moon')
    skyBody.parts.lit.forEach(([c, r]) => roles.set(key(c, r), 'moon'))

  // Clouds written last — overwrite sun/moon cells so drifting clouds break sky objects
  if (showCloud) {
    cloudCluster(cloudX,  CLOUD_Y ).forEach(([c, r]) => roles.set(key(c, r), 'cloud'))
    cloudCluster(cloud2X, CLOUD_Y2).forEach(([c, r]) => roles.set(key(c, r), 'cloud'))
  }

  // Randomised precipitation — reshuffles each cloud step, stable within it
  const { rainDrops, snowFar, snowNear, boltCells, fogPuffsFar, fogPuffsNear } = useMemo(() => {
    const rand = makeLCG(cloudPhase * 2654435761)
    const cx1  = getCloudX(cloudPhase)
    const cx2  = getCloud2X(cloudPhase)
    return {
      rainDrops: [
        ...randomDrops(cx1, CLOUD_Y,  8, rand),
        ...randomDrops(cx2, CLOUD_Y2, 8, rand),
      ],
      // Far snow: each centre expands into a 9-dot ❄ cluster (background)
      snowFar: [
        ...randomDrops(cx1, CLOUD_Y,  3, rand),
        ...randomDrops(cx2, CLOUD_Y2, 3, rand),
      ].flatMap(([c, r]) => snowflakeCluster(c, r)),
      // Near snow: slightly more flakes, larger stars (foreground)
      snowNear: [
        ...randomDrops(cx1, CLOUD_Y,  4, rand),
        ...randomDrops(cx2, CLOUD_Y2, 4, rand),
      ].flatMap(([c, r]) => snowflakeCluster(c, r)),
      boltCells: [
        ...randomBolt(cx1, CLOUD_Y,  rand),
        ...randomBolt(cx2, CLOUD_Y2, rand),
      ],
      // Scattered puffs drifting through the atmospheric band
      fogPuffsFar:  randomFogPuffs(10, 12, 20, rand),
      fogPuffsNear: randomFogPuffs(8,  24, 32, rand),
    }
  }, [cloudPhase])

  return (
    <div className="relative -mx-6 shrink-0 select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block w-full pointer-events-none"
        aria-hidden
      >
        {showFog && (
          <defs>
            <filter id="ambient-fog-blur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="0.6" />
            </filter>
          </defs>
        )}

        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const c = i % COLS
          const r = Math.floor(i / COLS)
          const role = roles.get(key(c, r)) ?? 'bg'
          const radius =
            role === 'bg'   ? RADIUS_BG :
            role === 'star' ? RADIUS_BG + 0.15 :
            role === 'moon' ? RADIUS_LIT + 0.35 :
            RADIUS_LIT
          // Stars each get a unique twinkle phase so they pulse independently
          const starDelay = role === 'star' ? `${((c * 7 + r * 13) % 41) * 0.2}s` : undefined
          return (
            <circle
              key={i}
              cx={c * SPACING + SPACING / 2}
              cy={r * SPACING + SPACING / 2}
              r={radius}
              fill="currentColor"
              className={`ambient-cell ${ROLE_CLASS[role]}${role === 'star' ? ' anim-star-twinkle' : ''}`}
              style={starDelay ? { animationDelay: starDelay } : undefined}
            />
          )
        })}

        {showRain && (
          <g fill="currentColor" className="text-blue-600 dark:text-blue-400 anim-fall">
            {rainDrops.map(([c, r], i) => (
              <circle key={`rain-${i}`}
                cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={RADIUS_LIT + 0.4} />
            ))}
          </g>
        )}

        {showSnow && (
          <>
            {/* Far snow: deeper frost, slow drift left — background depth */}
            <g fill="currentColor" className="text-sky-500 dark:text-sky-300 anim-snow-far">
              {snowFar.map(([c, r], i) => (
                <circle key={`snow-far-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={RADIUS_LIT - 0.2} />
              ))}
            </g>
            {/* Near snow: vivid frost, faster drift right — foreground */}
            <g fill="currentColor" className="text-sky-600 dark:text-sky-100 anim-snow-near">
              {snowNear.map(([c, r], i) => (
                <circle key={`snow-near-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={RADIUS_LIT + 0.2} />
              ))}
            </g>
          </>
        )}

        {/* Fog: five tapered mist ribbons + randomized puffs, all blurred */}
        {showFog && (
          <g filter="url(#ambient-fog-blur)">
            <g fill="currentColor" className="text-slate-600 dark:text-slate-300 anim-fog-1">
              {FOG_RIBBON_FAR.map(({ c, r, radius }, i) => (
                <circle key={`fog-1-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
            <g fill="currentColor" className="text-slate-700 dark:text-slate-200 anim-fog-2">
              {FOG_RIBBON_MID.map(({ c, r, radius }, i) => (
                <circle key={`fog-2-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
            <g fill="currentColor" className="text-zinc-700 dark:text-stone-100 anim-fog-3">
              {FOG_RIBBON_NEAR.map(({ c, r, radius }, i) => (
                <circle key={`fog-3-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
            {/* Right-side ribbons — drift the opposite way so the field feels balanced */}
            <g fill="currentColor" className="text-slate-600 dark:text-slate-300 anim-fog-4">
              {FOG_RIBBON_RIGHT_HI.map(({ c, r, radius }, i) => (
                <circle key={`fog-4-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
            <g fill="currentColor" className="text-slate-700 dark:text-slate-200 anim-fog-5">
              {FOG_RIBBON_RIGHT_LO.map(({ c, r, radius }, i) => (
                <circle key={`fog-5-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
            {/* Randomised scatter puffs — far layer drifts slowly, near layer shimmers */}
            <g fill="currentColor" className="text-slate-600 dark:text-slate-300 anim-fog-puff-far">
              {fogPuffsFar.map(({ c, r, radius }, i) => (
                <circle key={`fog-puff-far-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
            <g fill="currentColor" className="text-zinc-700 dark:text-stone-100 anim-fog-puff-near">
              {fogPuffsNear.map(({ c, r, radius }, i) => (
                <circle key={`fog-puff-near-${i}`}
                  cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={radius} />
              ))}
            </g>
          </g>
        )}

        {showBolt && (
          <g fill="currentColor" className="text-amber-400 dark:text-yellow-200 anim-flash">
            {boltCells.map(([c, r], i) => (
              <circle key={`bolt-${i}`}
                cx={c * SPACING + SPACING / 2} cy={r * SPACING + SPACING / 2} r={RADIUS_LIT + 0.4} />
            ))}
          </g>
        )}
      </svg>

      {/* Top + bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, var(--background) 0%, transparent 20%, transparent 48%, var(--background) 96%)',
        }}
      />

      {/* Clock + weather overlaid at the bottom of the dot field */}
      <div className="absolute bottom-5 left-6 right-6 flex flex-col gap-0.5 [&_span]:!text-foreground/75">
        {footer}
        <div className="text-xs tracking-wide text-foreground/60">
          {temperature !== null && condition
            ? <>Chennai · {Math.round(temperature)}° · {CONDITION_LABEL[condition]}</>
            : <span className="opacity-50">Loading weather…</span>}
        </div>
      </div>

      <style jsx global>{`
        .ambient-cell { transition: color 1.2s ease, r 1.2s ease; }

        /* Stars — each pulses on its own staggered cycle */
        .anim-star-twinkle { animation: star-twinkle 3.5s ease-in-out infinite; }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.15; r: 0.9; }
          50%      { opacity: 1;    r: 1.2; }
        }

        /* Rain */
        .anim-fall { animation: ambient-fall 1.1s linear infinite; }
        @keyframes ambient-fall {
          0%   { transform: translateY(-8px); opacity: 0; }
          25%  { opacity: 1; }
          100% { transform: translateY(8px);  opacity: 0; }
        }

        /* Snow — two parallax layers */
        .anim-snow-far  { animation: snow-far  5.2s linear infinite; }
        @keyframes snow-far {
          0%   { transform: translate(0,    -10px); opacity: 0;    }
          18%  {                                    opacity: 0.55;  }
          100% { transform: translate(-5px,  12px); opacity: 0;    }
        }

        .anim-snow-near { animation: snow-near 3.1s linear infinite 0.9s; }
        @keyframes snow-near {
          0%   { transform: translate(0,    -10px); opacity: 0;   }
          18%  {                                    opacity: 1;   }
          100% { transform: translate(4px,   12px); opacity: 0;   }
        }

        /* Fog — tapered mist ribbons breathing slowly at five depths */
        .anim-fog-1 { animation: fog-drift-1 22s ease-in-out infinite; }
        @keyframes fog-drift-1 {
          0%, 100% { transform: translateX(-6px);  opacity: 0.35; }
          50%      { transform: translateX(10px);  opacity: 0.7;  }
        }

        .anim-fog-2 { animation: fog-drift-2 28s ease-in-out infinite -7s; }
        @keyframes fog-drift-2 {
          0%, 100% { transform: translateX(8px);   opacity: 0.5;  }
          50%      { transform: translateX(-12px); opacity: 0.85; }
        }

        .anim-fog-3 { animation: fog-drift-3 24s ease-in-out infinite -3s; }
        @keyframes fog-drift-3 {
          0%, 100% { transform: translateX(-5px);  opacity: 0.55; }
          50%      { transform: translateX(9px);   opacity: 0.95; }
        }

        .anim-fog-4 { animation: fog-drift-4 26s ease-in-out infinite -11s; }
        @keyframes fog-drift-4 {
          0%, 100% { transform: translateX(7px);   opacity: 0.4;  }
          50%      { transform: translateX(-10px); opacity: 0.75; }
        }

        .anim-fog-5 { animation: fog-drift-5 30s ease-in-out infinite -5s; }
        @keyframes fog-drift-5 {
          0%, 100% { transform: translateX(-8px);  opacity: 0.5;  }
          50%      { transform: translateX(11px);  opacity: 0.9;  }
        }

        /* Fog scatter puffs — gently fade in/out so each reshuffle feels organic */
        .anim-fog-puff-far {
          animation: fog-puff-far 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes fog-puff-far {
          0%, 100% { opacity: 0;    transform: translate(-2px, 0) scale(0.9); }
          50%      { opacity: 0.55; transform: translate(3px,  0) scale(1.05); }
        }

        .anim-fog-puff-near {
          animation: fog-puff-near 2.6s ease-in-out infinite -0.8s;
          transform-origin: center;
        }
        @keyframes fog-puff-near {
          0%, 100% { opacity: 0;    transform: translate(2px, 0) scale(0.85); }
          50%      { opacity: 0.85; transform: translate(-3px, 0) scale(1.1); }
        }

        /* Lightning */
        .anim-flash { animation: ambient-flash 4s ease-in-out infinite; opacity: 0; }
        @keyframes ambient-flash {
          0%, 90%, 100% { opacity: 0;   }
          92%, 96%      { opacity: 1;   }
          94%           { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

export type { WeatherCondition }
