'use client'
import { Suspense, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Work } from '@/content/works'
import { useSound } from '@/hooks/useSound'
import { cn } from '@/lib/utils'
import { WorkModal } from '@/components/works/WorkModal'
import { WorkSheet } from '@/components/works/WorkSheet'
import { bodyLoaders, lazyBodies } from '@/content/works/bodies'
import { PhoneFrame } from '@/components/works/PhoneScene'
import { blurProps } from '@/content/blur'

/** Card-size iPhone frame used by the heroScene preview. */
function ScenePhone({ src }: { src: string }) {
  return <PhoneFrame src={src} alt="" imgWidth={240} />
}

// Rendered card width per column count (see useColumnCount). Lets next/image
// pick a candidate close to the real card size instead of the full source.
const CARD_SIZES =
  '(max-width: 639px) 100vw, (min-width: 3440px) 20vw, (min-width: 2560px) 25vw, (min-width: 1920px) 33vw, 50vw'

function ProjectCard({
  project,
  index,
  priority = false,
  onOpen,
}: {
  project: Work
  index: number
  /** Eager-load the image — set for the first card of each column (above the fold). */
  priority?: boolean
  onOpen: (project: Work) => void
}) {
  const { playHover, playClick } = useSound()
  const Body = project.type === 'component' ? lazyBodies[project.slug] ?? null : null
  const aspect = project.aspect ?? '4/3'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full"
      onMouseEnter={() => {
        playHover()
        // Warm the body chunk so the modal opens with content already there.
        bodyLoaders[project.slug]?.()
      }}
    >
      <Link
        href={`/works/${project.slug}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          playClick()
          onOpen(project)
        }}
        className="group block w-full"
      >
        <div
          style={{ aspectRatio: aspect }}
          className="relative w-full overflow-hidden rounded-2xl border border-black/15 transition-colors duration-300 group-hover:border-black/60 dark:border-white/15 dark:group-hover:border-white/60"
        >
          <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.06]">
            {project.heroScene ? (
              // Multi-phone preview: app screens in device frames floating
              // over a backdrop — the card-size echo of the PhoneScene look.
              <div className="absolute inset-0">
                <Image
                  src={project.heroScene.bg}
                  alt=""
                  fill
                  {...blurProps(project.heroScene.bg)}
                  sizes={CARD_SIZES}
                  priority={priority}
                  className={cn(
                    'object-cover',
                    // Soften only IoT's busy photographic thumbnail; Blubees
                    // stays crisp.
                    project.slug === 'iot-automation' && 'scale-105 blur-[2px]',
                  )}
                />
                {/* Gradient wash so the floating phone reads over the busy
                    photographic backdrop. Scoped to IoT so Blubees' clean
                    thumbnail is untouched. */}
                {project.slug === 'iot-automation' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                )}
                {project.heroScene.screens.length === 1 ? (
                  // Single hero phone — upright, centered, cropped by the
                  // card's bottom edge like a product still.
                  <div className="absolute left-1/2 top-[12%] w-[70%] -translate-x-1/2">
                    <ScenePhone src={project.heroScene.screens[0]} />
                  </div>
                ) : (
                  project.heroScene.screens.slice(0, 2).map((src, i) => (
                    <div
                      key={src}
                      className={cn(
                        'absolute',
                        i === 0
                          ? 'left-[7%] top-[8%] w-[55%] rotate-[-6deg]'
                          : 'right-[6%] top-[36%] w-[58%] rotate-[4deg]',
                      )}
                    >
                      <ScenePhone src={src} />
                    </div>
                  ))
                )}
              </div>
            ) : project.heroPreview ? (
              // Composed preview: a product screenshot framed in the card.
              // With a `bg` it floats over that backdrop, anchored to one side
              // and bleeding off the opposite edge; without one it fills the card.
              <div className="absolute inset-0 bg-white">
                {project.heroPreview.bg && (
                  <>
                    <Image
                      src={project.heroPreview.bg}
                      alt=""
                      fill
                      {...blurProps(project.heroPreview.bg)}
                      sizes={CARD_SIZES}
                      priority={priority}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />
                  </>
                )}
                <div
                  className={cn(
                    'absolute overflow-hidden bg-white ring-1 ring-black/10',
                    project.heroPreview.bg
                      ? project.heroPreview.anchor === 'right'
                        ? 'bottom-0 left-0 right-[7%] top-[8%] rounded-tr-xl shadow-2xl shadow-black/40'
                        : 'bottom-0 left-[7%] right-0 top-[8%] rounded-tl-xl shadow-2xl shadow-black/40'
                      : 'inset-0',
                  )}
                >
                  <Image
                    src={project.heroPreview.src}
                    alt=""
                    fill
                    {...blurProps(project.heroPreview.src)}
                    sizes={CARD_SIZES}
                    priority={priority}
                    style={{ objectPosition: project.heroPreview.focus ?? 'left top' }}
                    className="object-cover"
                  />
                </div>
              </div>
            ) : project.type === 'image' && project.media?.src ? (
              <Image
                src={project.media.src}
                alt=""
                fill
                {...blurProps(project.media.src)}
                sizes={CARD_SIZES}
                priority={priority}
                className="object-cover"
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
            ) : project.cover ? (
              <Image
                src={project.cover}
                alt=""
                fill
                {...blurProps(project.cover)}
                sizes={CARD_SIZES}
                priority={priority}
                style={{ objectPosition: project.coverPosition }}
                className="object-cover"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${project.accent}`} />
            )}
          </div>
            <div className="absolute left-2 right-2 top-2 flex flex-wrap items-center justify-end gap-1.5">
              {(project.type === 'case-study' || project.type === 'component') && project.tags[0] && (
                <span className="rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
                  {project.tags[0]}
                </span>
              )}
              {(project.disciplines ?? ['Design']).map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm"
                >
                  {d}
                </span>
              ))}
            </div>
        </div>
        <div className="flex flex-col gap-1 px-1 pt-2">
          <span className="text-sm font-medium text-foreground leading-snug line-clamp-1 sm:line-clamp-none">
            {project.name}
          </span>
          <span className="text-xs leading-snug text-muted-foreground line-clamp-2">
            {project.tagline ?? project.summary ?? project.category}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

// Shortest-column distribution: place each item into the column with the
// least accumulated height so far. Heights are aspect-ratio derived (since
// every column is the same width). This guarantees columns end roughly even
// — the standard Pinterest packing algorithm.
function distributeIntoColumns(works: Work[], numCols: number): Work[][] {
  const cols: Work[][] = Array.from({ length: numCols }, () => [])
  const heights = new Array<number>(numCols).fill(0)

  for (const work of works) {
    const [w, h] = (work.aspect ?? '4/3').split('/').map(Number)
    const heightUnit = h / w
    let minIdx = 0
    for (let i = 1; i < numCols; i++) {
      if (heights[i] < heights[minIdx]) minIdx = i
    }
    cols[minIdx].push(work)
    heights[minIdx] += heightUnit
  }
  return cols
}

function useColumnCount() {
  // SSR default matches the smallest viewport.
  const [cols, setCols] = useState(2)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const sm   = window.matchMedia('(min-width: 640px)')
    const xxl  = window.matchMedia('(min-width: 1920px)')
    const qhd  = window.matchMedia('(min-width: 2560px)')
    const uhd  = window.matchMedia('(min-width: 3440px)')
    const update = () =>
      setCols(
        uhd.matches ? 5 :
        qhd.matches ? 4 :
        xxl.matches ? 3 :
        sm.matches  ? 2 : 1
      )
    update()
    const queries = [sm, xxl, qhd, uhd]
    queries.forEach(q => q.addEventListener('change', update))
    return () => queries.forEach(q => q.removeEventListener('change', update))
  }, [])
  return cols
}

export function MasonryGrid({ projects }: { projects: Work[] }) {
  const numCols = useColumnCount()
  const columns = distributeIntoColumns(projects, numCols)
  const [openWork, setOpenWork] = useState<Work | null>(null)

  const handleOpen = useCallback((project: Work) => {
    setOpenWork(project)
  }, [])

  const handleClose = useCallback(() => {
    setOpenWork(null)
  }, [])

  return (
    <div className="p-4 sm:p-5">
      <div className="flex gap-4 sm:gap-5">
        {columns.map((col, ci) => (
          <div key={ci} className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-5">
            {col.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={ci * columns.length + i}
                priority={i === 0}
                onOpen={handleOpen}
              />
            ))}
          </div>
        ))}
      </div>

      <WorkSheet
        work={openWork?.type === 'case-study' ? openWork : null}
        onClose={handleClose}
      />
      <WorkModal
        work={openWork && openWork.type !== 'case-study' ? openWork : null}
        onClose={handleClose}
      />
    </div>
  )
}
