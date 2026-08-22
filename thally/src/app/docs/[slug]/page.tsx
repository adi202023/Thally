'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GitCommit,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/design-system/Badge';
import { CodeBlock } from '@/components/design-system/CodeBlock';

const DOCS_DATA: Record<
  string,
  {
    title: string;
    version: string;
    publishedCommit: string;
    updatedAt: string;
    content: string;
    prev?: { title: string; slug: string };
    next?: { title: string; slug: string };
    toc: Array<{ id: string; title: string; level: number }>;
  }
> = {
  'smart-sync': {
    title: 'Smart Sync',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'how-it-works', title: 'How It Works', level: 2 },
      { id: 'enabling-smart-sync', title: 'Enabling Smart Sync', level: 2 },
      { id: 'source-selection', title: 'Documentation Source Selection', level: 2 },
      { id: 'sync-frequency', title: 'Sync Frequency Options', level: 2 },
      { id: 'permissions', title: 'Permissions & Access', level: 2 },
      { id: 'rate-limits', title: 'Rate Limits', level: 2 },
    ],
    prev: { title: 'Getting Started', slug: 'getting-started' },
    next: { title: 'Project Settings', slug: 'project-settings' },
    content: `# Smart Sync

Smart Sync lets you automatically synchronize **the documentation sources you select** with your connected product repository.

## How It Works {#how-it-works}

Thally monitors your repository for changes. When a meaningful product change is detected, Smart Sync updates the documentation sources you have selected for synchronization.

## Enabling Smart Sync {#enabling-smart-sync}

To enable Smart Sync in your project:
1. Open **Project Settings**
2. Select **Smart Sync**
3. Choose the documentation sources you want to synchronize
4. Select a synchronization frequency
5. Click **Enable Smart Sync**

## Documentation Source Selection {#source-selection}

Choose which documentation areas Smart Sync should keep synchronized. Only the sources you explicitly select will be updated — other documentation areas remain unchanged.

## Sync Frequency {#sync-frequency}

| Frequency | Description |
|---|---|
| **Manual** | Sync only when you manually trigger it |
| **Hourly** | Sync every hour when new commits are detected |
| **Daily** | Sync once per day |
| **Weekly** | Sync once per week |

## Permissions & Access {#permissions}

Smart Sync requires the \`project:write\` scope. Users with Viewer or Editor roles cannot enable Smart Sync.

## Rate Limits {#rate-limits}

Smart Sync is limited to **100 synchronizations per day** per project to prevent runaway API requests.`,
  },
  'getting-started': {
    title: 'Getting Started with Thally',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'what-is-thally', title: 'What is Thally?', level: 2 },
      { id: 'quickstart', title: 'Quick Start', level: 2 },
      { id: 'next-steps', title: 'Next Steps', level: 2 },
    ],
    next: { title: 'Smart Sync', slug: 'smart-sync' },
    content: `# Getting Started with Thally

Welcome to Thally — the control plane for keeping product knowledge synchronized with product reality.

## What is Thally? {#what-is-thally}

Thally detects meaningful product changes, identifies the documentation and knowledge affected by those changes, gathers source evidence, proposes documentation updates, lets a human maintainer review them, creates a deployment preview, and publishes only approved documentation.

## Quick Start {#quickstart}

### 1. Connect your repository
Connect your GitHub, GitLab, or Bitbucket repository from **Project Settings → Repository**.

### 2. Configure knowledge areas
Define which sections of your product documentation correspond to which repository code paths.

### 3. Review proposals
When Thally detects a product change, it generates a documentation update proposal. Maintainers review, edit, and approve proposals before deployment.

## Next Steps {#next-steps}

- [Smart Sync](/docs/smart-sync) *(New in v1.1.0)*
- [Project Settings](/docs/project-settings)
- [API Reference](/docs/api-reference)`,
  },
  'project-settings': {
    title: 'Project Settings',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'general-settings', title: 'General Settings', level: 2 },
      { id: 'smart-sync-settings', title: 'Smart Sync Settings', level: 2 },
      { id: 'webhooks', title: 'Repository Webhooks', level: 2 },
    ],
    prev: { title: 'Smart Sync', slug: 'smart-sync' },
    next: { title: 'Permissions', slug: 'permissions' },
    content: `# Project Settings

Configure your Thally project settings to match your team's development lifecycle.

## General Settings {#general-settings}

- **Project Name** — Display name for your product documentation repository
- **Description** — Summary of product capabilities

## Smart Sync Settings {#smart-sync-settings}

Configure automated documentation synchronization:
- **Enabled Sources** — Select which documentation categories to keep synchronized
- **Frequency** — Manual, Hourly, Daily, or Weekly
- **Status Indicator** — Shows last sync timestamp and current health

## Repository Webhooks {#webhooks}

Configure webhooks from GitHub or GitLab to notify Thally on pull request merges.`,
  },
  'permissions': {
    title: 'Permissions & Scopes',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'scopes', title: 'Permission Scopes', level: 2 },
      { id: 'roles', title: 'Role Mapping', level: 2 },
      { id: 'smart-sync-permission', title: 'Smart Sync Requirement', level: 2 },
    ],
    prev: { title: 'Project Settings', slug: 'project-settings' },
    next: { title: 'API Reference', slug: 'api-reference' },
    content: `# Permissions & Scopes

Thally uses fine-grained scope permissions to protect documentation integrity.

## Permission Scopes {#scopes}

| Scope | Description |
|---|---|
| \`project:read\` | View project and documentation |
| \`project:write\` | Modify settings and enable Smart Sync |
| \`docs:read\` | Read public and internal documentation |
| \`docs:write\` | Create and edit documentation proposals |
| \`docs:publish\` | Approve previews and trigger live deployments |
| \`admin\` | Full project and organization administration |

## Role Mapping {#roles}

| Role | Default Scopes |
|---|---|
| **Viewer** | \`project:read\`, \`docs:read\` |
| **Editor** | \`project:read\`, \`docs:read\`, \`docs:write\` |
| **Maintainer** | All scopes except \`admin\` |
| **Admin** | All scopes |

## Smart Sync Requirement {#smart-sync-permission}

Smart Sync configuration requires the **\`project:write\`** scope.`,
  },
  'api-reference': {
    title: 'API Reference',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'authentication', title: 'Authentication', level: 2 },
      { id: 'sync-endpoint', title: 'POST /v1/sync', level: 2 },
      { id: 'docs-endpoints', title: 'Documentation Endpoints', level: 2 },
    ],
    prev: { title: 'Permissions', slug: 'permissions' },
    next: { title: 'Changelog', slug: 'changelog' },
    content: `# API Reference

The Thally REST API provides programmatic control over documentation synchronization and retrieval.

## Authentication {#authentication}

All requests require a Bearer token:
\`\`\`http
Authorization: Bearer <your-api-token>
\`\`\`

## POST /v1/sync {#sync-endpoint}

Enable or update Smart Sync for a project. Requires \`project:write\` scope.

### Request Body
\`\`\`json
{
  "projectId": "project-demo-001",
  "sources": ["smart-sync", "project-settings", "api-reference"],
  "frequency": "daily"
}
\`\`\`

### Response
\`\`\`json
{
  "settings": {
    "enabled": true,
    "frequency": "daily",
    "documentationSources": ["smart-sync", "project-settings", "api-reference"]
  }
}
\`\`\`

## Documentation Endpoints {#docs-endpoints}

- \`GET /v1/docs\` — List all published documentation pages
- \`GET /v1/docs/:slug\` — Get a specific documentation page markdown`,
  },
  'troubleshooting': {
    title: 'Troubleshooting',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'repo-connection', title: 'Repository Connection', level: 2 },
      { id: 'sync-failures', title: 'Smart Sync Issues', level: 2 },
    ],
    prev: { title: 'API Reference', slug: 'api-reference' },
    next: { title: 'FAQ', slug: 'faq' },
    content: `# Troubleshooting

Common diagnostic steps for repository integration and documentation synchronization.

## Repository Connection {#repo-connection}

Ensure your GitHub personal access token has the \`repo\` scope and webhooks are active.

## Smart Sync Issues {#sync-failures}

If Smart Sync is not firing automatically:
1. Verify the project has \`project:write\` permissions configured.
2. Check the daily rate limit quota (max 100 syncs/day).
3. Verify that the modified files match the selected documentation sources.`,
  },
  'faq': {
    title: 'Frequently Asked Questions',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'auto-publish', title: 'Does Thally auto-publish without review?', level: 2 },
      { id: 'selective-sync', title: 'Does Smart Sync update all docs?', level: 2 },
    ],
    prev: { title: 'Troubleshooting', slug: 'troubleshooting' },
    next: { title: 'Changelog', slug: 'changelog' },
    content: `# Frequently Asked Questions

## Does Thally auto-publish without review? {#auto-publish}

**No.** Thally enforces a strict human-in-the-loop requirement. Every proposal must be reviewed and approved by a maintainer before it can be merged and deployed.

## Does Smart Sync update all docs? {#selective-sync}

**No.** Smart Sync only updates the documentation sources explicitly chosen by the user in Project Settings.`,
  },
  'changelog': {
    title: 'Changelog',
    version: '1.1.0',
    publishedCommit: 'a3f8c2d',
    updatedAt: '2026-08-18',
    toc: [
      { id: 'v1-1-0', title: 'v1.1.0 — Smart Sync Release', level: 2 },
      { id: 'v1-0-0', title: 'v1.0.0 — Initial Release', level: 2 },
    ],
    prev: { title: 'FAQ', slug: 'faq' },
    content: `# Changelog

## v1.1.0 — Smart Sync Release {#v1-1-0}
*Released August 18, 2026*

### New Features
- **Smart Sync** — Automatically synchronize selected documentation sources with connected repositories based on configurable schedules.
- **REST API Endpoint** — \`POST /api/v1/sync\` for automated configuration.
- **Permission Guard** — Enforce \`project:write\` scope for synchronization actions.

---

## v1.0.0 — Initial Release {#v1-0-0}
*Released August 1, 2026*

- Core documentation portal and repository change detection.`,
  },
};

export default function DocPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'getting-started';
  const doc = DOCS_DATA[slug] || DOCS_DATA['getting-started'];

  return (
    <>
      <article className="docs-content">
        {/* Breadcrumb & Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-tertiary">
            <Link href="/docs">Docs</Link>
            <span>/</span>
            <span className="text-primary font-medium">{doc.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="success" dot>Published</Badge>
            <Badge variant="default">v{doc.version}</Badge>
          </div>
        </div>

        {/* Commit & Date Stamp */}
        <div className="p-3 mb-6 bg-surface-0 border border-subtle rounded-lg flex items-center justify-between text-xs text-tertiary">
          <div className="flex items-center gap-2">
            <GitCommit size={14} className="text-brand" />
            <span>Published commit: <code>{doc.publishedCommit}</code></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>Updated: {doc.updatedAt}</span>
          </div>
        </div>

        {/* Rendered Prose Content */}
        <div
          className="docs-prose"
          dangerouslySetInnerHTML={{ __html: renderRichMarkdown(doc.content) }}
        />

        {/* Previous / Next Navigation */}
        <div className="docs-page-nav">
          {doc.prev ? (
            <Link href={`/docs/${doc.prev.slug}`} className="docs-page-nav-item prev">
              <span className="docs-page-nav-dir">
                <ArrowLeft size={12} /> Previous
              </span>
              <span className="docs-page-nav-title">{doc.prev.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {doc.next ? (
            <Link href={`/docs/${doc.next.slug}`} className="docs-page-nav-item next">
              <span className="docs-page-nav-dir">
                Next <ArrowRight size={12} />
              </span>
              <span className="docs-page-nav-title">{doc.next.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>

      {/* Table of Contents (Sticky right side) */}
      <aside className="docs-toc">
        <div className="docs-toc-title">On this page</div>
        <nav className="flex flex-col gap-1">
          {doc.toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`docs-toc-item ${item.level === 3 ? 'level-3' : ''}`}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}

function renderRichMarkdown(md: string): string {
  return md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*?) \{#(.*?)\}$/gim, '<h2 id="$2">$1</h2>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/```http\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/```json\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/```\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n/gim, '<br/><br/>');
}
