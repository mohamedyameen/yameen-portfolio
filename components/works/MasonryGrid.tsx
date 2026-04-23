'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import type { Project, CoverHeight } from '@/content/projects'

const coverHeightClass: Record<CoverHeight, string> = {
  sm: 'h-36',
  md: 'h-52',
  lg: 'h-72',
  xl: 'h-96',
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const h = coverHeightClass[project.coverHeight ?? 'md']

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.07, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full break-inside-avoid mb-2"
    >
      <Link
        href={`/works/${project.slug}`}
        className="group block w-full overflow-hidden rounded-md border border-border bg-background hover:bg-card transition-colors"
      >
        {/* Cover */}
        <div className={`w-full bg-gradient-to-br ${project.accent} ${h}`} />

        {/* Info */}
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-foreground leading-snug">
              {project.name}
            </span>
            <div className="flex gap-1 flex-wrap justify-end shrink-0">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {project.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
              {project.summary}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground/60 mt-1">{project.year}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export function MasonryGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="p-3 sm:p-4 columns-1 sm:columns-2 lg:columns-3 gap-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.slug} project={project} index={i} />
      ))}
    </div>
  )
}
