import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://thally.dev'

  const docSlugs = [
    'getting-started',
    'smart-sync',
    'project-settings',
    'permissions',
    'api-reference',
    'troubleshooting',
    'faq',
    'changelog',
    'agent-readiness',
  ]

  const docPages = docSlugs.map((slug) => ({
    url: `${base}/docs/${slug}`,
    lastModified: new Date('2026-08-31'),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/dashboard`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/impact`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/audit`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/agent`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/support`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    ...docPages,
  ]
}
