import { ImageResponse } from 'next/og'
import { siteAuthor, siteDescription } from '@/lib/site'

export const runtime = 'nodejs'
export const alt = 'Yameen · Lead Product Designer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
            'radial-gradient(120% 120% at 0% 0%, #1e1b4b 0%, #0a0a0a 55%, #000 100%)',
          color: '#fafafa',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#a5b4fc',
            }}
          />
          <div style={{ fontSize: 28, letterSpacing: 2, opacity: 0.85 }}>
            {siteAuthor.toUpperCase()}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -2,
            }}
          >
            Lead Product Designer
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.3,
              maxWidth: 920,
              opacity: 0.78,
            }}
          >
            {siteDescription}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 24,
            opacity: 0.6,
          }}
        >
          <div>yameen.design</div>
          <div>Portfolio · 2026</div>
        </div>
      </div>
    ),
    { ...size },
  )
}
