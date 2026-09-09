import type { MetadataRoute } from 'next'
import { works } from '@/content/works'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]

  const workRoutes: MetadataRoute.Sitemap = works.map((w) => ({
    url: `${siteUrl}/works/${w.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...workRoutes]
}
