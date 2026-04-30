'use client'
import { useState } from 'react'

const PALETTES = [
  ['#0f172a', '#1e293b', '#94a3b8', '#f1f5f9'],
  ['#3f1d38', '#831843', '#fb7185', '#fde68a'],
  ['#0c4a6e', '#0e7490', '#22d3ee', '#ecfeff'],
  ['#14532d', '#65a30d', '#bef264', '#fef9c3'],
  ['#3b0764', '#7c3aed', '#c4b5fd', '#fdf4ff'],
  ['#1c1917', '#7c2d12', '#f97316', '#fef3c7'],
]

export default function PaletteShift() {
  const [i, setI] = useState(0)
  const palette = PALETTES[i]

  return (
    <div className="flex flex-col items-stretch gap-4">
      <button
        type="button"
        onClick={() => setI((n) => (n + 1) % PALETTES.length)}
        className="group flex h-40 w-full overflow-hidden rounded-md border border-border transition-transform hover:scale-[1.01] active:scale-[0.99]"
        aria-label="Shift palette"
      >
        {palette.map((c) => (
          <div
            key={c}
            className="flex-1 transition-all duration-300"
            style={{ backgroundColor: c }}
          />
        ))}
      </button>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Click the swatches to re-roll.</span>
        <span className="font-mono">
          {i + 1} / {PALETTES.length}
        </span>
      </div>
    </div>
  )
}
