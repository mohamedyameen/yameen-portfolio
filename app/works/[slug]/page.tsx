import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { works } from '@/content/works'
import { bodyLoaders } from '@/content/works/bodies'
import { WorkHero } from '@/components/works/WorkHero'
import { siteUrl, siteAuthor, siteName } from '@/lib/site'

type Params = { slug: string }

export function generateStaticParams() {
  return works.map(({ slug }) => ({ slug }))
}

function coverFor(work: (typeof works)[number]): string | undefined {
  if (work.type === 'image' && work.media?.src) return work.media.src
  return work.cover
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params
  const work = works.find(w => w.slug === slug)
  if (!work) return {}

  const url = `${siteUrl}/works/${work.slug}`
  const title = work.name
  const description = work.summary ?? `${work.name} — ${work.category}`
  const cover = coverFor(work)
  // Absolute URL only if the cover looks like a path under /public.
  // Otherwise (remote URL or undefined), let Next's per-route opengraph-image
  // fall through automatically.
  const ogImages = cover && cover.startsWith('/')
    ? [{ url: cover, alt: work.name }]
    : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName,
      images: ogImages,
      tags: work.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages?.map(i => i.url),
    },
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

  const url = `${siteUrl}/works/${work.slug}`
  const cover = coverFor(work)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: work.name,
    headline: work.name,
    description: work.summary ?? undefined,
    url,
    image: cover && cover.startsWith('/') ? `${siteUrl}${cover}` : cover,
    keywords: work.tags.join(', '),
    genre: work.category,
    dateCreated: work.year,
    author: {
      '@type': 'Person',
      name: siteAuthor,
      url: siteUrl,
    },
    creator: {
      '@type': 'Person',
      name: siteAuthor,
      url: siteUrl,
    },
    ...(work.client && { sourceOrganization: { '@type': 'Organization', name: work.client } }),
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 sm:px-5 md:px-10 py-8 sm:py-10 md:py-16 flex flex-col gap-10 sm:gap-12 md:gap-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {work.type === 'image' && work.media ? (
        <Image
          src={work.media.src}
          alt={work.name}
          width={1600}
          height={1000}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="w-full h-auto rounded-2xl ring-1 ring-border"
        />
      ) : work.type === 'video' && work.media ? (
        <video
          src={work.media.src}
          poster={work.media.poster}
          controls
          playsInline
          className="w-full rounded-2xl ring-1 ring-border bg-black"
          aria-label={work.name}
        />
      ) : (
        <WorkHero work={work} />
      )}

      {Body && <Body />}
    </article>
  )
}
