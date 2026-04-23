import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { BlockRenderer } from '@/components/works/BlockRenderer'
import { FadeUp } from '@/components/ui/FadeUp'
import { projects } from '@/content/projects'

type Params = { slug: string }

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) return {}
  return {
    title: project.name,
    description: project.summary ?? undefined,
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)
  if (!project) notFound()

  return (
    <article className="mx-auto w-full max-w-3xl px-5 md:px-10 py-10 md:py-16 flex flex-col gap-8">
      {/* Header */}
      <FadeUp>
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {project.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {project.name}
        </h1>
        {project.summary && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[65ch]">
            {project.summary}
          </p>
        )}

        {/* Meta row */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border text-xs">
          {project.client && (
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Client</dt>
              <dd className="text-foreground">{project.client}</dd>
            </div>
          )}
          {project.role && (
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="text-foreground">{project.role}</dd>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Year</dt>
            <dd className="text-foreground">{project.year}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Type</dt>
            <dd className="text-foreground capitalize">{project.kind ?? 'work'}</dd>
          </div>
        </dl>
      </header>

      </FadeUp>

      {/* Cover */}
      <FadeUp delay={0.1}>
      <div className={`w-full bg-gradient-to-br ${project.accent} rounded-md aspect-[16/9]`} />
      </FadeUp>

      {/* Blocks */}
      {project.blocks && project.blocks.length > 0 && (
        <div className="flex flex-col gap-6">
          {project.blocks.map((block, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <BlockRenderer block={block} />
            </FadeUp>
          ))}
        </div>
      )}
    </article>
  )
}
