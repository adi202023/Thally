import { NextRequest, NextResponse } from 'next/server'

// Metadata used to build JSON-LD TechArticle structured data
const DOC_META: Record<string, {
  title: string
  description: string
  datePublished: string
  dateModified: string
  keywords: string[]
}> = {
  'getting-started': {
    title: 'Getting Started with Thally',
    description: 'Quickstart guide to connect a repository and begin using Thally for documentation synchronization.',
    datePublished: '2026-07-01',
    dateModified: '2026-08-18',
    keywords: ['thally', 'quickstart', 'getting started', 'documentation sync', 'repository'],
  },
  'smart-sync': {
    title: 'Smart Sync — Thally',
    description: 'Automated documentation synchronization triggered by product repository changes in Thally.',
    datePublished: '2026-08-18',
    dateModified: '2026-08-18',
    keywords: ['smart sync', 'thally', 'automated sync', 'documentation', 'repository webhook'],
  },
  'project-settings': {
    title: 'Project Settings — Thally',
    description: 'Configure repository webhooks, Smart Sync frequency, and team assignments in Thally.',
    datePublished: '2026-07-01',
    dateModified: '2026-08-18',
    keywords: ['project settings', 'thally', 'webhook', 'configuration'],
  },
  'permissions': {
    title: 'Permissions & Scopes — Thally',
    description: 'Role-based access control and scope requirements for Thally projects.',
    datePublished: '2026-07-01',
    dateModified: '2026-08-18',
    keywords: ['permissions', 'scopes', 'rbac', 'roles', 'thally'],
  },
  'api-reference': {
    title: 'API Reference — Thally',
    description: 'REST API reference for Thally including authentication, sync endpoints, and documentation retrieval.',
    datePublished: '2026-07-01',
    dateModified: '2026-08-18',
    keywords: ['api', 'rest api', 'thally', 'sync endpoint', 'jwt', 'authentication'],
  },
  'troubleshooting': {
    title: 'Troubleshooting — Thally',
    description: 'Common issues and diagnostic steps for repository connection and Smart Sync failures in Thally.',
    datePublished: '2026-07-01',
    dateModified: '2026-08-18',
    keywords: ['troubleshooting', 'thally', 'debug', 'repository connection', 'smart sync'],
  },
  'faq': {
    title: 'FAQ — Thally',
    description: 'Frequently asked questions about Thally documentation synchronization and human-in-the-loop review.',
    datePublished: '2026-07-01',
    dateModified: '2026-08-18',
    keywords: ['faq', 'thally', 'frequently asked questions'],
  },
  'changelog': {
    title: 'Changelog — Thally',
    description: 'Release notes for Thally including the Smart Sync v1.1.0 release.',
    datePublished: '2026-08-18',
    dateModified: '2026-08-18',
    keywords: ['changelog', 'release notes', 'thally', 'v1.1.0', 'smart sync'],
  },
  'agent-readiness': {
    title: 'Agent Readiness Report — Thally',
    description: 'Formal audit of the Thally documentation site for AI agent and crawler accessibility across all surfaces.',
    datePublished: '2026-08-31',
    dateModified: '2026-08-31',
    keywords: ['agent readiness', 'mcp', 'json-ld', 'sitemap', 'crawler', 'thally', 'ai agent'],
  },
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const meta = DOC_META[slug]

  if (!meta) {
    return NextResponse.json({ error: 'Document not found', slug }, { status: 404 })
  }

  const canonicalUrl = `https://thally.dev/docs/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': canonicalUrl,
    name: meta.title,
    headline: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    keywords: meta.keywords.join(', '),
    url: canonicalUrl,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'TechArticle',
      name: 'Thally Documentation',
      url: 'https://thally.dev/docs',
    },
    author: {
      '@type': 'Organization',
      name: 'Thally',
      url: 'https://thally.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Thally',
      url: 'https://thally.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://thally.dev/favicon.ico',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    about: {
      '@type': 'SoftwareApplication',
      name: 'Thally',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: [canonicalUrl],
    },
    sameAs: [
      `/api/docs/${slug}`,
      `/api/docs/${slug}?format=markdown`,
    ],
  }

  return NextResponse.json(jsonLd, {
    status: 200,
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=86400',
      'X-Thally-Surface': 'jsonld',
    },
  })
}
