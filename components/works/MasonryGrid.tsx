'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project, CoverHeight } from '@/content/projects'
import { useSound } from '@/hooks/useSound'

const coverHeightClass: Record<CoverHeight, string> = {
  sm: 'h-36',
  md: 'h-52',
  lg: 'h-72',
  xl: 'h-96',
  '2xl': 'h-[32rem]',
}

const previewImages: Record<string, string[]> = {
  'facilio-atom':   [
    'https://picsum.photos/seed/atom1/480/320',
    'https://picsum.photos/seed/atom2/480/320',
    'https://picsum.photos/seed/atom3/480/320',
  ],
  'design-system':  [
    'https://picsum.photos/seed/ds1/480/320',
    'https://picsum.photos/seed/ds2/480/320',
    'https://picsum.photos/seed/ds3/480/320',
  ],
  'fsm':            [
    'https://picsum.photos/seed/fsm1/480/320',
    'https://picsum.photos/seed/fsm2/480/320',
    'https://picsum.photos/seed/fsm3/480/320',
  ],
  'iot-automation': [
    'https://picsum.photos/seed/iot1/480/320',
    'https://picsum.photos/seed/iot2/480/320',
    'https://picsum.photos/seed/iot3/480/320',
  ],
  'mellow':         [
    'https://picsum.photos/seed/mel1/480/320',
    'https://picsum.photos/seed/mel2/480/320',
    'https://picsum.photos/seed/mel3/480/320',
  ],
  'blue-whistle':   [
    'https://picsum.photos/seed/bw1/480/320',
    'https://picsum.photos/seed/bw2/480/320',
    'https://picsum.photos/seed/bw3/480/320',
  ],
  'blubees':        [
    'https://picsum.photos/seed/bb1/480/320',
    'https://picsum.photos/seed/bb2/480/320',
    'https://picsum.photos/seed/bb3/480/320',
  ],
}

function ProjectCard({
  project,
  index,
  hasHover,
  onEnter,
  onLeave,
}: {
  project: Project
  index: number
  hasHover: boolean
  onEnter: (slug: string) => void
  onLeave: () => void
}) {
  const h = coverHeightClass[project.coverHeight ?? 'md']
  const { playHover, playClick } = useSound()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full break-inside-avoid mb-2"
      onMouseEnter={hasHover ? () => {
        playHover()
        onEnter(project.slug)
      } : undefined}
      onMouseLeave={hasHover ? onLeave : undefined}
    >
      <Link
        href={`/works/${project.slug}`}
        onClick={playClick}
        className="group block w-full overflow-hidden rounded-md border border-border bg-background hover:bg-card transition-colors"
      >
        <div className={`w-full bg-gradient-to-br ${project.accent} ${h}`} />
        <div className="flex flex-col gap-1.5 p-4">
          <span className="text-sm font-medium text-foreground leading-snug">
            {project.name}
          </span>
          {project.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {project.summary}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

// Reorder so no two adjacent projects share the same coverHeight.
// With CSS columns, adjacent items in the array tend to land in adjacent
// columns, so this keeps same-size tiles from sitting side-by-side.
function spreadBySize(arr: Project[]): Project[] {
  const out = [...arr]
  for (let i = 1; i < out.length; i++) {
    const prev = out[i - 1].coverHeight ?? 'md'
    const curr = out[i].coverHeight ?? 'md'
    if (prev !== curr) continue
    // Find a later item with a different size and swap it into place.
    const swapIdx = out.findIndex((p, k) => k > i && (p.coverHeight ?? 'md') !== prev)
    if (swapIdx !== -1) {
      ;[out[i], out[swapIdx]] = [out[swapIdx], out[i]]
    }
  }
  return out
}

export function MasonryGrid({ projects }: { projects: Project[] }) {
  const orderedProjects = spreadBySize(projects)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [activeSlug, setActiveSlug]   = useState<string | null>(null)
  const [imgIndex, setImgIndex]       = useState(0)
  const [pos, setPos]                 = useState({ x: 0, y: 0 })
  const [hasHover, setHasHover]       = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHasHover(mq.matches)
    const update = (e: MediaQueryListEvent) => setHasHover(e.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const handleEnter = useCallback((slug: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)

    // Preload images to avoid lag
    const imgs = previewImages[slug] ?? []
    imgs.forEach(src => { const img = new Image(); img.src = src })

    setHoveredSlug(slug)
    setActiveSlug(slug)
    setImgIndex(0)

    if (slideTimer.current) clearInterval(slideTimer.current)
    if (imgs.length > 1) {
      slideTimer.current = setInterval(() => {
        setImgIndex(i => (i + 1) % imgs.length)
      }, 1400)
    }
  }, [])

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setHoveredSlug(null)
      if (slideTimer.current) clearInterval(slideTimer.current)
    }, 120)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => () => {
    if (slideTimer.current) clearInterval(slideTimer.current)
  }, [])

  const images = activeSlug ? (previewImages[activeSlug] ?? []) : []
  const currentSrc = images[imgIndex] ?? ''

  return (
    <div
      className="p-2 columns-1 sm:columns-2 lg:columns-3 gap-2"
      onMouseMove={hasHover ? handleMouseMove : undefined}
    >
      {orderedProjects.map((project, i) => (
        <ProjectCard
          key={project.slug}
          project={project}
          index={i}
          hasHover={hasHover}
          onEnter={handleEnter}
          onLeave={handleLeave}
        />
      ))}

      <AnimatePresence>
        {hasHover && hoveredSlug && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 14 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.88, y: 14 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed z-50 pointer-events-none w-72 h-48 rounded-2xl overflow-hidden border border-border shadow-2xl"
            style={{ left: pos.x, top: pos.y, translateX: '-50%', translateY: '-110%' }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={currentSrc}
                src={currentSrc}
                alt=""
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{    x: '-100%' }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
