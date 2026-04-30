import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { FadeUp } from '@/components/ui/FadeUp'
import { works } from '@/content/works'
import { bodyLoaders } from '@/content/works/bodies'

type Params = { slug: string }

export function generateStaticParams() {
  return works.map(({ slug }) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const work = works.find(w => w.slug === slug)
  if (!work) return {}
  return {
    title: work.name,
    description: work.summary ?? undefined,
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const work = works.find(w => w.slug === slug)
  if (!work) notFound()

  const loadBody = bodyLoaders[slug]
  const Body = loadBody ? (await loadBody()).default : null

  return (
    <article className="mx-auto w-full max-w-3xl px-5 md:px-10 py-10 md:py-16 flex flex-col gap-8">
      <FadeUp>
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {work.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {work.name}
          </h1>
          {work.summary && (
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-[65ch]">
              {work.summary}
            </p>
          )}

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border text-xs">
            {work.client && (
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Client</dt>
                <dd className="text-foreground">{work.client}</dd>
              </div>
            )}
            {work.role && (
              <div className="flex flex-col gap-1">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="text-foreground">{work.role}</dd>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Year</dt>
              <dd className="text-foreground">{work.year}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="text-foreground capitalize">{work.kind ?? 'work'}</dd>
            </div>
          </dl>
        </header>
      </FadeUp>

      <FadeUp delay={0.1}>
        {work.type === 'image' && work.media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={work.media.src}
            alt={work.name}
            className="w-full rounded-md border border-border"
          />
        ) : work.type === 'video' && work.media ? (
          <video
            src={work.media.src}
            poster={work.media.poster}
            controls
            playsInline
            className="w-full rounded-md border border-border bg-black"
          />
        ) : (
          <div className={`w-full bg-gradient-to-br ${work.accent} rounded-md aspect-[16/9]`} />
        )}
      </FadeUp>

      {Body && (
        <FadeUp delay={0.2}>
          <div className="flex flex-col gap-6">
            <Body />
          </div>
        </FadeUp>
      )}
    </article>
  )
}
