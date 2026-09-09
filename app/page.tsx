import { works } from '@/content/works'
import { MasonryGrid } from '@/components/works/MasonryGrid'
import {
  siteUrl,
  siteName,
  siteAuthor,
  siteDescription,
} from '@/lib/site'

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteAuthor,
  alternateName: 'Yameen',
  url: siteUrl,
  jobTitle: 'Lead Product Designer',
  worksFor: { '@type': 'Organization', name: 'Facilio' },
  description: siteDescription,
  image: `${siteUrl}/opengraph-image`,
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  inLanguage: 'en',
  publisher: {
    '@type': 'Person',
    name: siteAuthor,
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personLd, websiteLd]),
        }}
      />
      <div className="relative min-h-dvh">
        <MasonryGrid projects={works} />
      </div>
    </>
  )
}
