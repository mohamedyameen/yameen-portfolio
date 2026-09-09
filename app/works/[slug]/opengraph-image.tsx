import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import { works } from '@/content/works'
import { siteAuthor } from '@/lib/site'

export const runtime = 'nodejs'
export const alt = 'Yameen — case study'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return works.map(({ slug }) => ({ slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = works.find((w) => w.slug === slug)
  if (!work) notFound()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(120% 120% at 100% 0%, #312e81 0%, #0a0a0a 55%, #000 100%)',
          color: '#fafafa',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 26,
            opacity: 0.75,
            letterSpacing: 2,
          }}
        >
          <div>{siteAuthor.toUpperCase()}</div>
          <div>{work.year}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 32,
              opacity: 0.7,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            {work.category}
          </div>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {work.name}
          </div>
          {work.summary ? (
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.35,
                maxWidth: 980,
                opacity: 0.78,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {work.summary}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {work.tags.slice(0, 4).map((t) => (
            <div
              key={t}
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: 24,
                opacity: 0.85,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
