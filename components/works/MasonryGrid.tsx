'use client'
import { Suspense, useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work, CoverHeight } from '@/content/works'
import { useSound } from '@/hooks/useSound'
import { WorkModal } from '@/components/works/WorkModal'
import { WorkSheet } from '@/components/works/WorkSheet'
import { bodyLoaders, lazyBodies } from '@/content/works/bodies'

// Apple-ish smooth ease-out — used for card→overlay morph + backdrop fade.
const OPEN_TRANSITION = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }

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
  onOpen,
}: {
  project: Work
  index: number
  hasHover: boolean
  onEnter: (slug: string) => void
  onLeave: () => void
  onOpen: (project: Work) => void
}) {
  const h = coverHeightClass[project.coverHeight ?? 'md']
  const { playHover, playClick } = useSound()
  const Body = project.type === 'component' ? lazyBodies[project.slug] ?? null : null

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
        // Warm the body chunk so the modal opens with content already there.
        bodyLoaders[project.slug]?.()
      } : undefined}
      onMouseLeave={hasHover ? onLeave : undefined}
    >
      <motion.div
        layoutId={`work-card-${project.slug}`}
        transition={OPEN_TRANSITION}
        className="group rounded-[20px] border border-border/80 bg-background p-3 hover:bg-card transition-colors"
      >
        <Link
          href={`/works/${project.slug}`}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
            e.preventDefault()
            playClick()
            onOpen(project)
          }}
          className="block w-full"
        >
          <div className={`relative w-full overflow-hidden rounded-2xl ${h}`}>
            {project.type === 'image' && project.media?.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.media.src}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : project.type === 'video' && project.media?.src ? (
              <video
                src={project.media.src}
                poster={project.media.poster}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            ) : project.type === 'component' && Body ? (
              <div className="absolute inset-0 pointer-events-none">
                <Suspense fallback={<div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />}>
                  <Body preview />
                </Suspense>
              </div>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
            )}
            {(project.type === 'case-study' || project.type === 'component') && project.tags[0] && (
              <span className="absolute right-2 top-2 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
                {project.tags[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-0.5 px-1 pb-1 pt-3">
            <span className="text-xs font-medium text-foreground leading-snug">
              {project.name}
            </span>
            {project.summary && (
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                {project.summary}
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

// Reorder so no two adjacent projects share the same coverHeight.
// With CSS columns, adjacent items in the array tend to land in adjacent
// columns, so this keeps same-size tiles from sitting side-by-side.
function spreadBySize(arr: Work[]): Work[] {
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

export function MasonryGrid({ projects }: { projects: Work[] }) {
  const orderedProjects = spreadBySize(projects)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const [activeSlug, setActiveSlug]   = useState<string | null>(null)
  const [imgIndex, setImgIndex]       = useState(0)
  const [pos, setPos]                 = useState({ x: 0, y: 0 })
  const [hasHover, setHasHover]       = useState(false)
  const [openWork, setOpenWork]       = useState<Work | null>(null)
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

  const handleOpen = useCallback((project: Work) => {
    if (slideTimer.current) clearInterval(slideTimer.current)
    setHoveredSlug(null)
    setOpenWork(project)
  }, [])

  const handleClose = useCallback(() => {
    setOpenWork(null)
  }, [])

  return (
    <div
      className="p-2 columns-2 md:columns-3 lg:columns-4 gap-2"
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
          onOpen={handleOpen}
        />
      ))}

      <WorkSheet
        work={openWork?.type === 'case-study' ? openWork : null}
        onClose={handleClose}
      />
      <WorkModal
        work={openWork && openWork.type !== 'case-study' ? openWork : null}
        onClose={handleClose}
      />

      <AnimatePresence>
        {hasHover && hoveredSlug && currentSrc && (
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
