import { NextRequest, NextResponse } from 'next/server'

// Canonical in-memory doc store — matches the UI DOCS_DATA
const DOCS_DATA: Record<string, {
  title: string; slug: string; version: string; updatedAt: string;
  publishedCommit: string; content: string;
  toc: Array<{ id: string; title: string; level: number }>;
  prev?: { title: string; slug: string };
  next?: { title: string; slug: string };
}> = {
  'getting-started': {
    title: 'Getting Started with Thally', slug: 'getting-started',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'what-is-thally', title: 'What is Thally?', level: 2 },
      { id: 'quickstart', title: 'Quick Start', level: 2 },
      { id: 'next-steps', title: 'Next Steps', level: 2 },
    ],
    next: { title: 'Smart Sync', slug: 'smart-sync' },
    content: `# Getting Started with Thally\n\nWelcome to Thally — the control plane for keeping product knowledge synchronized with product reality.\n\n## What is Thally? {#what-is-thally}\n\nThally detects meaningful product changes, identifies documentation affected, gathers source evidence, proposes updates, and publishes only approved documentation.\n\n## Quick Start {#quickstart}\n\n1. Connect your GitHub/GitLab/Bitbucket repository from Project Settings → Repository.\n2. Configure knowledge areas — map documentation sections to repository code paths.\n3. Review proposals — Thally generates proposals which maintainers approve before deployment.\n\n## Next Steps {#next-steps}\n\n- [Smart Sync](/docs/smart-sync)\n- [Project Settings](/docs/project-settings)\n- [API Reference](/docs/api-reference)`,
  },
  'smart-sync': {
    title: 'Smart Sync', slug: 'smart-sync',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'how-it-works', title: 'How It Works', level: 2 },
      { id: 'enabling-smart-sync', title: 'Enabling Smart Sync', level: 2 },
      { id: 'sync-frequency', title: 'Sync Frequency Options', level: 2 },
      { id: 'permissions', title: 'Permissions & Access', level: 2 },
      { id: 'rate-limits', title: 'Rate Limits', level: 2 },
    ],
    prev: { title: 'Getting Started', slug: 'getting-started' },
    next: { title: 'Project Settings', slug: 'project-settings' },
    content: `# Smart Sync\n\nSmart Sync automatically synchronizes selected documentation sources with your repository.\n\n## How It Works {#how-it-works}\n\nThally monitors your repository for changes. When a meaningful product change is detected, Smart Sync updates selected documentation sources.\n\n## Enabling Smart Sync {#enabling-smart-sync}\n\n1. Open Project Settings\n2. Select Smart Sync\n3. Choose documentation sources to synchronize\n4. Select a synchronization frequency\n5. Click Enable Smart Sync\n\n## Sync Frequency {#sync-frequency}\n\n| Frequency | Description |\n|---|---|\n| Manual | Sync only when manually triggered |\n| Hourly | Sync every hour when new commits detected |\n| Daily | Sync once per day |\n| Weekly | Sync once per week |\n\n## Permissions & Access {#permissions}\n\nSmart Sync requires the \`project:write\` scope.\n\n## Rate Limits {#rate-limits}\n\nLimited to 100 synchronizations per day per project.`,
  },
  'project-settings': {
    title: 'Project Settings', slug: 'project-settings',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'general-settings', title: 'General Settings', level: 2 },
      { id: 'smart-sync-settings', title: 'Smart Sync Settings', level: 2 },
      { id: 'webhooks', title: 'Repository Webhooks', level: 2 },
    ],
    prev: { title: 'Smart Sync', slug: 'smart-sync' },
    next: { title: 'Permissions', slug: 'permissions' },
    content: `# Project Settings\n\nConfigure your Thally project to match your team workflow.\n\n## General Settings {#general-settings}\n\n- Project Name — display name for your documentation repository\n- Description — summary of product capabilities\n\n## Smart Sync Settings {#smart-sync-settings}\n\n- Enabled Sources — select documentation categories to synchronize\n- Frequency — Manual, Hourly, Daily, or Weekly\n\n## Repository Webhooks {#webhooks}\n\nConfigure GitHub or GitLab webhooks to notify Thally on pull request merges.`,
  },
  'permissions': {
    title: 'Permissions & Scopes', slug: 'permissions',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'scopes', title: 'Permission Scopes', level: 2 },
      { id: 'roles', title: 'Role Mapping', level: 2 },
    ],
    prev: { title: 'Project Settings', slug: 'project-settings' },
    next: { title: 'API Reference', slug: 'api-reference' },
    content: `# Permissions & Scopes\n\nThally uses fine-grained scope permissions.\n\n## Permission Scopes {#scopes}\n\n| Scope | Description |\n|---|---|\n| \`project:read\` | View project and documentation |\n| \`project:write\` | Modify settings and enable Smart Sync |\n| \`docs:read\` | Read public and internal documentation |\n| \`docs:write\` | Create and edit documentation proposals |\n| \`docs:publish\` | Approve previews and trigger live deployments |\n| \`admin\` | Full project and organization administration |\n\n## Role Mapping {#roles}\n\n| Role | Default Scopes |\n|---|---|\n| Viewer | \`project:read\`, \`docs:read\` |\n| Editor | \`project:read\`, \`docs:read\`, \`docs:write\` |\n| Maintainer | All scopes except \`admin\` |\n| Admin | All scopes |`,
  },
  'api-reference': {
    title: 'API Reference', slug: 'api-reference',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'authentication', title: 'Authentication', level: 2 },
      { id: 'sync-endpoint', title: 'POST /v1/sync', level: 2 },
      { id: 'docs-endpoints', title: 'Documentation Endpoints', level: 2 },
    ],
    prev: { title: 'Permissions', slug: 'permissions' },
    next: { title: 'Troubleshooting', slug: 'troubleshooting' },
    content: `# API Reference\n\nThe Thally REST API provides programmatic control over documentation synchronization.\n\n## Authentication {#authentication}\n\nAll requests require a Bearer token:\n\`\`\`http\nAuthorization: Bearer <your-api-token>\n\`\`\`\n\n## POST /v1/sync {#sync-endpoint}\n\nEnable Smart Sync for a project. Requires \`project:write\` scope.\n\n### Request Body\n\`\`\`json\n{\n  "projectId": "project-demo-001",\n  "sources": ["smart-sync", "api-reference"],\n  "frequency": "daily"\n}\n\`\`\`\n\n### Response\n\`\`\`json\n{\n  "settings": { "enabled": true, "frequency": "daily" }\n}\n\`\`\`\n\n## Documentation Endpoints {#docs-endpoints}\n\n- \`GET /api/docs\` — List all published documentation pages\n- \`GET /api/docs/:slug\` — Get a specific documentation page as JSON\n- \`GET /api/docs/:slug/jsonld\` — Get JSON-LD structured data\n- \`GET /api/mcp\` — Model Context Protocol manifest`,
  },
  'troubleshooting': {
    title: 'Troubleshooting', slug: 'troubleshooting',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'repo-connection', title: 'Repository Connection', level: 2 },
      { id: 'sync-failures', title: 'Smart Sync Issues', level: 2 },
    ],
    prev: { title: 'API Reference', slug: 'api-reference' },
    next: { title: 'FAQ', slug: 'faq' },
    content: `# Troubleshooting\n\nCommon diagnostic steps for Thally.\n\n## Repository Connection {#repo-connection}\n\nEnsure your GitHub personal access token has the \`repo\` scope and webhooks are active.\n\n## Smart Sync Issues {#sync-failures}\n\n1. Verify the project has \`project:write\` permissions.\n2. Check daily rate limit quota (max 100 syncs/day).\n3. Verify modified files match selected documentation sources.`,
  },
  'faq': {
    title: 'Frequently Asked Questions', slug: 'faq',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [
      { id: 'auto-publish', title: 'Does Thally auto-publish?', level: 2 },
      { id: 'selective-sync', title: 'Does Smart Sync update all docs?', level: 2 },
    ],
    prev: { title: 'Troubleshooting', slug: 'troubleshooting' },
    next: { title: 'Changelog', slug: 'changelog' },
    content: `# FAQ\n\n## Does Thally auto-publish without review? {#auto-publish}\n\nNo. Every proposal must be reviewed and approved by a maintainer before deployment.\n\n## Does Smart Sync update all docs? {#selective-sync}\n\nNo. Smart Sync only updates the documentation sources explicitly chosen in Project Settings.`,
  },
  'changelog': {
    title: 'Changelog', slug: 'changelog',
    version: '1.1.0', updatedAt: '2026-08-18', publishedCommit: 'a3f8c2d',
    toc: [{ id: 'v1-1-0', title: 'v1.1.0 — Smart Sync', level: 2 }],
    prev: { title: 'FAQ', slug: 'faq' },
    content: `# Changelog\n\n## v1.1.0 — Smart Sync Release {#v1-1-0}\n\nReleased 2026-08-18\n\n- Smart Sync: automated repository-triggered documentation synchronization\n- Documentation Source Selection: choose which knowledge areas to synchronize\n- Sync Frequency options: Manual, Hourly, Daily, Weekly`,
  },
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const doc = DOCS_DATA[slug]

  if (!doc) {
    return NextResponse.json({ error: 'Document not found', slug }, { status: 404 })
  }

  const format = _req.nextUrl.searchParams.get('format')

  // Return raw markdown when ?format=markdown
  if (format === 'markdown') {
    return new NextResponse(doc.content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'X-Thally-Surface': 'markdown',
      },
    })
  }

  return NextResponse.json(
    {
      slug: doc.slug,
      title: doc.title,
      version: doc.version,
      updatedAt: doc.updatedAt,
      publishedCommit: doc.publishedCommit,
      toc: doc.toc,
      prev: doc.prev ?? null,
      next: doc.next ?? null,
      content: doc.content,
      markdownUrl: `/api/docs/${slug}?format=markdown`,
      jsonLdUrl: `/api/docs/${slug}/jsonld`,
      htmlUrl: `/docs/${slug}`,
    },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Thally-Surface': 'json',
      },
    }
  )
}
