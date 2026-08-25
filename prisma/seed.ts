// Thally — Demo Seed Data
// Seeds the Smart Sync scenario for immediate first-launch experience.
// Run: npx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Thally demo data...');

  // ── Org ────────────────────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'thally-demo' },
    update: {},
    create: {
      slug: 'thally-demo',
      name: 'Thally Demo',
      planTier: 'demo',
    },
  });

  // ── Users ──────────────────────────────────────────────────────────────────
  const maintainer = await prisma.user.upsert({
    where: { email: 'alex@thally.dev' },
    update: {},
    create: {
      email: 'alex@thally.dev',
      name: 'Alex Chen',
      role: 'maintainer',
    },
  });

  // ── Repository ────────────────────────────────────────────────────────────
  const repo = await prisma.repository.upsert({
    where: { id: 'repo-demo-001' },
    update: {},
    create: {
      id: 'repo-demo-001',
      organizationId: org.id,
      provider: 'mock',
      ownerName: 'thally-demo',
      repoName: 'product-core',
      defaultBranch: 'main',
    },
  });

  // ── Commit ─────────────────────────────────────────────────────────────────
  const commit = await prisma.commit.upsert({
    where: { id: 'commit-smartsync-001' },
    update: {},
    create: {
      id: 'commit-smartsync-001',
      repositoryId: repo.id,
      sha: 'a3f8c2d1e9b4f72a8c3e5d1b2a7f9c8e4b3d6a1f',
      shortSha: 'a3f8c2d',
      message: 'feat(sync): introduce Smart Sync for connected documentation\n\nAdds the Smart Sync feature that lets users automatically synchronize\nselected documentation sources with their connected product repository.\n\nChanges:\n- Add SmartSyncSettings model and migrations\n- Add /api/v1/sync endpoint with JWT auth\n- Add sync frequency options (manual, hourly, daily, weekly)\n- Add documentation source selection UI\n- Add sync status indicators\n- Add permission checks (requires project:write scope)\n- Add rate limiting (max 100 syncs/day)\n- Add audit logging for all sync events\n\nBreaking: None\nMigration: Required\n\nCloses #247\nReviewed-by: Jordan Kim <jordan@thally.dev>',
      author: 'Alex Chen',
      authorEmail: 'alex@thally.dev',
      authoredAt: new Date('2026-08-18T14:23:00Z'),
      additions: 847,
      deletions: 12,
      filesChanged: 18,
      diff: `diff --git a/src/models/SmartSyncSettings.ts b/src/models/SmartSyncSettings.ts
new file mode 100644
index 0000000..f3a8c2d
--- /dev/null
+++ b/src/models/SmartSyncSettings.ts
@@ -0,0 +1,42 @@
+export interface SmartSyncSettings {
+  id: string;
+  projectId: string;
+  enabled: boolean;
+  frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
+  documentationSources: string[];  // slugs of selected doc areas
+  lastSyncAt?: Date;
+  nextSyncAt?: Date;
+  createdAt: Date;
+  updatedAt: Date;
+}
+
+export const SYNC_FREQUENCY_LABELS: Record<SmartSyncSettings['frequency'], string> = {
+  manual: 'Manual only',
+  hourly: 'Every hour',
+  daily: 'Once a day',
+  weekly: 'Once a week',
+};
diff --git a/src/api/v1/sync/route.ts b/src/api/v1/sync/route.ts
new file mode 100644
index 0000000..b7c3e1a
--- /dev/null
+++ b/src/api/v1/sync/route.ts
@@ -0,0 +1,89 @@
+import { requireScope } from '@/lib/auth';
+import { db } from '@/lib/db';
+import { z } from 'zod';
+
+const SyncRequestSchema = z.object({
+  projectId: z.string(),
+  sources: z.array(z.string()).min(1, 'Select at least one documentation source'),
+  frequency: z.enum(['manual', 'hourly', 'daily', 'weekly']),
+});
+
+export async function POST(req: Request) {
+  const user = await requireScope(req, 'project:write');
+  const body = await req.json();
+  const data = SyncRequestSchema.parse(body);
+
+  const settings = await db.smartSyncSettings.upsert({
+    where: { projectId: data.projectId },
+    update: { ...data, enabled: true },
+    create: { ...data, enabled: true },
+  });
+
+  await db.auditLog.create({
+    data: {
+      actorId: user.id,
+      action: 'smart_sync.enabled',
+      resourceId: settings.id,
+    },
+  });
+
+  return Response.json({ settings });
+}
diff --git a/src/settings/SmartSyncPanel.tsx b/src/settings/SmartSyncPanel.tsx
new file mode 100644
index 0000000..9d4f8e2
--- /dev/null
+++ b/src/settings/SmartSyncPanel.tsx
@@ -0,0 +1,124 @@
+export function SmartSyncPanel({ project }: { project: Project }) {
+  const [sources, setSources] = useState<string[]>([]);
+  const [frequency, setFrequency] = useState<SyncFrequency>('daily');
+
+  return (
+    <div className="smart-sync-panel">
+      <h2>Smart Sync</h2>
+      <p>
+        Automatically synchronize the documentation sources you select
+        with your connected product repository.
+      </p>
+      <SourceSelector
+        sources={availableSources}
+        selected={sources}
+        onChange={setSources}
+      />
+      <FrequencySelector value={frequency} onChange={setFrequency} />
+      <SyncStatusIndicator projectId={project.id} />
+      <button onClick={handleSave}>Enable Smart Sync</button>
+    </div>
+  );
+}
diff --git a/tests/smartSync.test.ts b/tests/smartSync.test.ts
new file mode 100644
index 0000000..e5f9a1c
--- /dev/null
+++ b/tests/smartSync.test.ts
@@ -0,0 +1,67 @@
+describe('Smart Sync', () => {
+  it('requires at least one documentation source', async () => {
+    const res = await POST({ sources: [], frequency: 'daily', projectId: 'p1' });
+    expect(res.status).toBe(400);
+  });
+
+  it('requires project:write scope', async () => {
+    const res = await POST({ sources: ['getting-started'], frequency: 'daily', projectId: 'p1' });
+    // called without auth header
+    expect(res.status).toBe(401);
+  });
+
+  it('creates sync settings and audit log entry', async () => {
+    const res = await authenticatedPOST({ sources: ['getting-started'], frequency: 'daily', projectId: 'p1' });
+    expect(res.status).toBe(200);
+    const { settings } = await res.json();
+    expect(settings.enabled).toBe(true);
+    expect(settings.frequency).toBe('daily');
+  });
+
+  it('only syncs selected documentation sources', async () => {
+    const res = await authenticatedPOST({ sources: ['api-reference'], frequency: 'weekly', projectId: 'p1' });
+    const { settings } = await res.json();
+    expect(settings.documentationSources).toEqual(['api-reference']);
+    expect(settings.documentationSources).not.toContain('changelog');
+  });
+});`,
    },
  });

  // ── Project ────────────────────────────────────────────────────────────────
  const project = await prisma.project.upsert({
    where: { id: 'project-demo-001' },
    update: {},
    create: {
      id: 'project-demo-001',
      organizationId: org.id,
      name: 'Thally Product Core',
      description: 'Core product documentation for the Thally platform',
      status: 'active',
    },
  });

  // ── Knowledge Areas ────────────────────────────────────────────────────────
  const knowledgeAreas = [
    { id: 'ka-getting-started', slug: 'getting-started', title: 'Getting Started', description: 'Onboarding guides and quickstart', category: 'guide', sortOrder: 1 },
    { id: 'ka-smart-sync', slug: 'smart-sync', title: 'Smart Sync', description: 'Automatic documentation synchronization', category: 'guide', sortOrder: 2 },
    { id: 'ka-project-settings', slug: 'project-settings', title: 'Project Settings', description: 'Configuration and preferences', category: 'guide', sortOrder: 3 },
    { id: 'ka-permissions', slug: 'permissions', title: 'Permissions', description: 'Access control and scopes', category: 'reference', sortOrder: 4 },
    { id: 'ka-api-reference', slug: 'api-reference', title: 'API Reference', description: 'REST API endpoints', category: 'api', sortOrder: 5 },
    { id: 'ka-troubleshooting', slug: 'troubleshooting', title: 'Troubleshooting', description: 'Common issues and solutions', category: 'guide', sortOrder: 6 },
    { id: 'ka-faq', slug: 'faq', title: 'FAQ', description: 'Frequently asked questions', category: 'guide', sortOrder: 7 },
    { id: 'ka-changelog', slug: 'changelog', title: 'Changelog', description: 'Release notes and history', category: 'reference', sortOrder: 8 },
    { id: 'ka-billing', slug: 'billing', title: 'Billing', description: 'Plans and payments', category: 'guide', sortOrder: 9 },
    { id: 'ka-teams', slug: 'teams', title: 'Teams', description: 'Team management', category: 'guide', sortOrder: 10 },
    { id: 'ka-security', slug: 'security', title: 'Security Overview', description: 'Security practices and compliance', category: 'reference', sortOrder: 11 },
  ];

  for (const ka of knowledgeAreas) {
    await prisma.knowledgeArea.upsert({
      where: { id: ka.id },
      update: {},
      create: { ...ka, projectId: project.id },
    });
  }

  // ── Documentation Pages ─────────────────────────────────────────────────
  const docPages = [
    {
      id: 'page-getting-started',
      slug: 'getting-started',
      knowledgeAreaId: 'ka-getting-started',
      title: 'Getting Started with Thally',
      sortOrder: 1,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# Getting Started with Thally

Welcome to Thally — the control plane for keeping product knowledge synchronized with product reality.

## What is Thally?

Thally detects meaningful product changes, identifies the documentation and knowledge affected by those changes, gathers source evidence, proposes documentation updates, lets a human maintainer review them, creates a deployment preview, and publishes only approved documentation.

## Quick Start

### 1. Connect your repository

Connect your GitHub, GitLab, or Bitbucket repository to Thally from **Project Settings → Repository**.

### 2. Configure knowledge areas

Tell Thally which parts of your documentation correspond to which product areas.

### 3. Let Thally watch for changes

Thally monitors your repository for commits and pull requests that affect product behavior.

### 4. Review proposals

When Thally detects a change, it generates a documentation update proposal. A human maintainer reviews and approves it before anything is published.

## Next Steps

- [Project Settings](/docs/project-settings)
- [Smart Sync](/docs/smart-sync) *(New!)*
- [API Reference](/docs/api-reference)
`,
    },
    {
      id: 'page-smart-sync-draft',
      slug: 'smart-sync',
      knowledgeAreaId: 'ka-smart-sync',
      title: 'Smart Sync',
      sortOrder: 2,
      status: 'draft',
      version: '1.0.0',
      content: `# Smart Sync

> **Draft** — This page is pending review.

Smart Sync is a new feature that lets you automatically synchronize documentation with your connected repository.

*Full documentation coming soon.*
`,
    },
    {
      id: 'page-project-settings',
      slug: 'project-settings',
      knowledgeAreaId: 'ka-project-settings',
      title: 'Project Settings',
      sortOrder: 3,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# Project Settings

Configure your Thally project to match your team's workflow.

## General Settings

- **Project Name** — The display name for your project
- **Description** — A brief description of the project

## Repository Connection

Connect a GitHub, GitLab, or Bitbucket repository to enable change detection.

## Notifications

Configure who receives alerts when Thally detects a product change.

## Advanced

- **Analysis sensitivity** — Controls how aggressively Thally flags potential documentation impact
- **Auto-assign** — Automatically assign documentation tasks to a team member
`,
    },
    {
      id: 'page-permissions',
      slug: 'permissions',
      knowledgeAreaId: 'ka-permissions',
      title: 'Permissions',
      sortOrder: 4,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# Permissions

Thally uses a scope-based permission model.

## Scopes

| Scope | Description |
|---|---|
| \`project:read\` | View project and documentation |
| \`project:write\` | Edit settings, enable Smart Sync |
| \`docs:read\` | Read documentation |
| \`docs:write\` | Create and edit documentation |
| \`docs:publish\` | Approve and publish documentation |
| \`admin\` | Full project administration |

## Roles

| Role | Scopes |
|---|---|
| Viewer | \`project:read\`, \`docs:read\` |
| Editor | \`project:read\`, \`docs:read\`, \`docs:write\` |
| Maintainer | All scopes except \`admin\` |
| Admin | All scopes |

## Smart Sync Permission

Smart Sync requires the **\`project:write\`** scope. Viewers and Editors cannot enable Smart Sync.
`,
    },
    {
      id: 'page-api-reference',
      slug: 'api-reference',
      knowledgeAreaId: 'ka-api-reference',
      title: 'API Reference',
      sortOrder: 5,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# API Reference

The Thally REST API provides programmatic access to all Thally features.

## Base URL

\`\`\`
https://api.thally.dev/v1
\`\`\`

## Authentication

All requests require a Bearer token:

\`\`\`http
Authorization: Bearer <your-api-token>
\`\`\`

## Endpoints

### Projects

\`GET /v1/projects\` — List all projects  
\`POST /v1/projects\` — Create a project  
\`GET /v1/projects/:id\` — Get a project  

### Changes

\`GET /v1/changes\` — List product changes  
\`GET /v1/changes/:id\` — Get a change detail  

### Documentation

\`GET /v1/docs\` — List documentation pages  
\`GET /v1/docs/:slug\` — Get a documentation page  
`,
    },
    {
      id: 'page-troubleshooting',
      slug: 'troubleshooting',
      knowledgeAreaId: 'ka-troubleshooting',
      title: 'Troubleshooting',
      sortOrder: 6,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# Troubleshooting

## Repository not connecting

Ensure your personal access token has the \`repo\` scope for GitHub repositories.

## Analysis not running

Analysis runs automatically when Thally receives a webhook. Check **Project Settings → Webhooks** to verify the webhook is configured.

## Documentation not updating

All documentation updates require explicit human approval. Check the **Reviews** tab for pending proposals.
`,
    },
    {
      id: 'page-faq',
      slug: 'faq',
      knowledgeAreaId: 'ka-faq',
      title: 'FAQ',
      sortOrder: 7,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# Frequently Asked Questions

## Does Thally automatically publish documentation?

No. Thally always requires a human reviewer to approve documentation changes before they are published.

## Which repositories does Thally support?

GitHub, GitLab, and Bitbucket. A mock/local provider is available for demo and development.

## What AI model does Thally use?

Thally supports multiple AI providers. In Demo Mode, a deterministic analysis engine is used instead of a live AI model — results are clearly labeled.

## How many documentation pages can I have?

This depends on your plan. The demo allows unlimited pages for evaluation purposes.
`,
    },
    {
      id: 'page-changelog',
      slug: 'changelog',
      knowledgeAreaId: 'ka-changelog',
      title: 'Changelog',
      sortOrder: 8,
      status: 'published',
      version: '1.0.0',
      publishedAt: new Date('2026-08-01T00:00:00Z'),
      content: `# Changelog

## v1.1.0 — 2026-08-18

### New Features

- **Smart Sync** — Automatically synchronize the documentation sources you select with your connected product repository. Configure sync frequency (manual, hourly, daily, weekly) and choose which documentation areas to keep in sync. Requires \`project:write\` scope.

### Improvements

- Improved analysis confidence scoring
- Faster evidence indexing

### Bug Fixes

- Fixed an issue where audit events were not recorded for rejected proposals

---

## v1.0.0 — 2026-08-01

Initial release of Thally.
`,
    },
  ];

  for (const page of docPages) {
    await prisma.documentationPage.upsert({
      where: { id: page.id },
      update: { content: page.content, status: page.status },
      create: { ...page, projectId: project.id },
    });
  }

  // ── Product Change ─────────────────────────────────────────────────────────
  const productChange = await prisma.productChange.upsert({
    where: { id: 'change-smartsync-001' },
    update: {},
    create: {
      id: 'change-smartsync-001',
      projectId: project.id,
      repositoryId: repo.id,
      commitId: commit.id,
      title: 'Smart Sync — Automatic Documentation Synchronization',
      description: 'Introduces the Smart Sync feature that lets users automatically synchronize selected documentation sources with their connected product repository.',
      changeType: 'feature',
      severity: 'high',
      status: 'published',
      detectedAt: new Date('2026-08-18T14:25:00Z'),
      analyzedAt: new Date('2026-08-18T14:26:30Z'),
    },
  });

  // ── Evidence ───────────────────────────────────────────────────────────────
  const evidenceItems = [
    {
      id: 'ev-001',
      type: 'commit',
      title: 'feat(sync): introduce Smart Sync',
      description: 'The primary commit introducing the Smart Sync feature.',
      commitSha: 'a3f8c2d',
      whyItMatters: 'This is the root cause of all documentation impact. The commit introduces a completely new user-visible feature.',
    },
    {
      id: 'ev-002',
      type: 'file',
      title: 'src/models/SmartSyncSettings.ts',
      description: 'New data model for Smart Sync configuration',
      sourceFile: 'src/models/SmartSyncSettings.ts',
      lineStart: 1,
      lineEnd: 42,
      content: `export interface SmartSyncSettings {
  id: string;
  projectId: string;
  enabled: boolean;
  frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  documentationSources: string[];  // slugs of selected doc areas
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}`,
      whyItMatters: 'Defines the data shape of Smart Sync. The documentationSources field proves that only selected sources are synced — not all documentation.',
    },
    {
      id: 'ev-003',
      type: 'api_definition',
      title: 'POST /api/v1/sync',
      description: 'New API endpoint for enabling Smart Sync',
      sourceFile: 'src/api/v1/sync/route.ts',
      lineStart: 1,
      lineEnd: 40,
      content: `const SyncRequestSchema = z.object({
  projectId: z.string(),
  sources: z.array(z.string()).min(1, 'Select at least one documentation source'),
  frequency: z.enum(['manual', 'hourly', 'daily', 'weekly']),
});`,
      whyItMatters: 'API endpoint requires explicit source selection. The min(1) validator confirms at least one source must be chosen — not all documentation is synced by default.',
    },
    {
      id: 'ev-004',
      type: 'permission',
      title: 'requireScope(req, "project:write")',
      description: 'Smart Sync requires the project:write scope',
      sourceFile: 'src/api/v1/sync/route.ts',
      lineStart: 14,
      lineEnd: 14,
      content: `const user = await requireScope(req, 'project:write');`,
      whyItMatters: 'Permissions documentation must be updated to include the project:write scope requirement for Smart Sync.',
    },
    {
      id: 'ev-005',
      type: 'ui_screenshot',
      title: 'SmartSyncPanel.tsx — Settings UI',
      description: 'New settings panel component for Smart Sync configuration',
      sourceFile: 'src/settings/SmartSyncPanel.tsx',
      lineStart: 1,
      lineEnd: 30,
      content: `export function SmartSyncPanel({ project }: { project: Project }) {
  return (
    <div className="smart-sync-panel">
      <h2>Smart Sync</h2>
      <p>
        Automatically synchronize the documentation sources you select
        with your connected product repository.
      </p>
      <SourceSelector sources={availableSources} selected={sources} onChange={setSources} />
      <FrequencySelector value={frequency} onChange={setFrequency} />
      <SyncStatusIndicator projectId={project.id} />
    </div>
  );
}`,
      whyItMatters: 'The UI copy confirms the feature description. "the documentation sources you select" confirms user-controlled selection.',
    },
    {
      id: 'ev-006',
      type: 'test',
      title: 'tests/smartSync.test.ts',
      description: 'Test suite for Smart Sync behavior',
      sourceFile: 'tests/smartSync.test.ts',
      lineStart: 1,
      lineEnd: 35,
      content: `it('only syncs selected documentation sources', async () => {
  const res = await authenticatedPOST({ sources: ['api-reference'], frequency: 'weekly', projectId: 'p1' });
  const { settings } = await res.json();
  expect(settings.documentationSources).toEqual(['api-reference']);
  expect(settings.documentationSources).not.toContain('changelog');
});`,
      whyItMatters: 'Tests confirm that only explicitly selected sources are synchronized. This directly contradicts an "all documentation" claim.',
    },
    {
      id: 'ev-007',
      type: 'changelog',
      title: 'CHANGELOG.md entry',
      description: 'Changelog entry describing Smart Sync to users',
      sourceFile: 'CHANGELOG.md',
      lineStart: 5,
      lineEnd: 10,
      content: `## v1.1.0 — Smart Sync

**Smart Sync** — Automatically synchronize the documentation sources you select
with your connected product repository. Configure sync frequency and choose
which documentation areas to keep in sync.`,
      whyItMatters: 'The official changelog entry is the authoritative user-facing description. "the documentation sources you select" is the precise correct wording.',
    },
    {
      id: 'ev-008',
      type: 'config',
      title: 'Rate limiting configuration',
      description: 'Smart Sync has a rate limit of 100 syncs/day',
      sourceFile: 'src/api/v1/sync/route.ts',
      lineStart: 5,
      lineEnd: 5,
      content: `// Rate limit: max 100 syncs/day per project`,
      whyItMatters: 'Relevant for troubleshooting documentation.',
    },
    {
      id: 'ev-009',
      type: 'existing_doc',
      title: 'Existing: Getting Started page',
      description: 'Getting Started page needs to mention Smart Sync as a new capability',
      sourceFile: 'docs/getting-started.md',
      whyItMatters: 'Users reading Getting Started will not know Smart Sync exists unless it is linked from that page.',
    },
    {
      id: 'ev-010',
      type: 'existing_doc',
      title: 'Existing: Project Settings page',
      description: 'Project Settings page needs a Smart Sync section',
      sourceFile: 'docs/project-settings.md',
      whyItMatters: 'Smart Sync is configured in Project Settings. Users expect to find Smart Sync settings here.',
    },
    {
      id: 'ev-011',
      type: 'existing_doc',
      title: 'Existing: Permissions page',
      description: 'Permissions page missing project:write scope for Smart Sync',
      sourceFile: 'docs/permissions.md',
      whyItMatters: 'The project:write scope requirement for Smart Sync is a new permission change that must be documented.',
    },
    {
      id: 'ev-012',
      type: 'existing_doc',
      title: 'Existing: API Reference page',
      description: 'API Reference missing POST /api/v1/sync endpoint',
      sourceFile: 'docs/api-reference.md',
      whyItMatters: 'Developers integrating programmatically will look for the sync endpoint in the API reference.',
    },
    {
      id: 'ev-013',
      type: 'existing_doc',
      title: 'Existing: Changelog page',
      description: 'Changelog must be updated to include Smart Sync release note',
      sourceFile: 'docs/changelog.md',
      whyItMatters: 'Users tracking product updates read the changelog.',
    },
    {
      id: 'ev-014',
      type: 'code_snippet',
      title: 'Frequency options enum',
      description: 'Available sync frequency options',
      sourceFile: 'src/models/SmartSyncSettings.ts',
      lineStart: 14,
      lineEnd: 20,
      content: `export const SYNC_FREQUENCY_LABELS: Record<SmartSyncSettings['frequency'], string> = {
  manual: 'Manual only',
  hourly: 'Every hour',
  daily: 'Once a day',
  weekly: 'Once a week',
};`,
      whyItMatters: 'Documentation must match the exact frequency options the product supports.',
    },
  ];

  for (const ev of evidenceItems) {
    await prisma.evidence.upsert({
      where: { id: ev.id },
      update: {},
      create: {
        ...ev,
        productChangeId: productChange.id,
      },
    });
  }

  // ── Impact Report ──────────────────────────────────────────────────────────
  const impactReport = await prisma.impactReport.upsert({
    where: { id: 'ir-smartsync-001' },
    update: {},
    create: {
      id: 'ir-smartsync-001',
      productChangeId: productChange.id,
      changeSummary: 'The Smart Sync feature introduces a new user-configurable documentation synchronization capability. Users can enable automatic synchronization of selected documentation sources at configurable frequencies. The feature requires the project:write permission scope and exposes a new API endpoint.',
      userImpact: 'Users with project:write access can now configure automatic documentation synchronization. They can select specific documentation areas to sync and choose a frequency (manual, hourly, daily, weekly). Users without project:write cannot access this feature.',
      confidence: 'high',
      risks: JSON.stringify([
        'Documentation claiming Smart Sync synchronizes "all" documentation would be inaccurate — only selected sources are synced',
        'Missing the permission requirement (project:write) could mislead users who cannot access the feature',
        'Not documenting the rate limit (100 syncs/day) could cause confusion when limits are hit',
        'FAQ may need a clarifying question about what happens to unselected documentation sources',
      ]),
      recommendedActions: JSON.stringify([
        'Create a dedicated Smart Sync documentation page explaining setup, frequency options, and source selection',
        'Update Project Settings documentation to include the Smart Sync section',
        'Update Permissions documentation to include the project:write scope requirement',
        'Update API Reference to include the POST /api/v1/sync endpoint',
        'Update Changelog with the v1.1.0 Smart Sync release note',
        'Update Getting Started to link to Smart Sync as a new capability',
        'Consider updating FAQ with a question clarifying that only selected sources are synchronized',
      ]),
      analysisMode: 'demo',
    },
  });

  // Impact report items
  const impactItems = [
    { id: 'ii-001', knowledgeAreaId: 'ka-smart-sync', evidenceId: 'ev-001', affectedStatus: 'definitely', confidence: 'high', reasoning: 'Smart Sync is an entirely new knowledge area. A dedicated documentation page does not exist yet. This is the highest priority documentation gap.' },
    { id: 'ii-002', knowledgeAreaId: 'ka-project-settings', evidenceId: 'ev-005', affectedStatus: 'definitely', confidence: 'high', reasoning: 'Smart Sync is configured in Project Settings. The current Project Settings documentation does not mention Smart Sync. Users navigating to settings will expect to find it documented here.' },
    { id: 'ii-003', knowledgeAreaId: 'ka-getting-started', evidenceId: 'ev-009', affectedStatus: 'definitely', confidence: 'high', reasoning: 'Getting Started is the first page new users read. Smart Sync is a significant new capability that should be surfaced here with a link to the dedicated page.' },
    { id: 'ii-004', knowledgeAreaId: 'ka-permissions', evidenceId: 'ev-004', affectedStatus: 'definitely', confidence: 'high', reasoning: 'Smart Sync requires the project:write scope. This is a new permission implication that must be documented. Users and administrators need to know which roles can enable Smart Sync.' },
    { id: 'ii-005', knowledgeAreaId: 'ka-api-reference', evidenceId: 'ev-003', affectedStatus: 'definitely', confidence: 'high', reasoning: 'A new POST /api/v1/sync endpoint was introduced. Developers using the API need the endpoint documented including required scopes, request schema, and rate limits.' },
    { id: 'ii-006', knowledgeAreaId: 'ka-changelog', evidenceId: 'ev-007', affectedStatus: 'definitely', confidence: 'high', reasoning: 'The changelog must be updated with the Smart Sync v1.1.0 release note so users tracking product updates are aware of the new feature.' },
    { id: 'ii-007', knowledgeAreaId: 'ka-faq', evidenceId: 'ev-006', affectedStatus: 'possibly', confidence: 'medium', reasoning: 'Users may ask whether Smart Sync syncs all documentation or only selected sources. A clarifying FAQ entry could prevent confusion, but it is not strictly required if the Smart Sync page is clear.' },
    { id: 'ii-008', knowledgeAreaId: 'ka-billing', evidenceId: null, affectedStatus: 'unaffected', confidence: 'high', reasoning: 'Smart Sync is available on all plans in this release. Billing documentation does not need to change.' },
    { id: 'ii-009', knowledgeAreaId: 'ka-teams', evidenceId: null, affectedStatus: 'unaffected', confidence: 'high', reasoning: 'Smart Sync permissions are project-scoped, not team-scoped. Team management documentation is unaffected.' },
    { id: 'ii-010', knowledgeAreaId: 'ka-security', evidenceId: null, affectedStatus: 'unaffected', confidence: 'high', reasoning: 'Smart Sync uses the existing authentication and authorization infrastructure. No new security concepts are introduced that require Security Overview updates.' },
  ];

  for (const item of impactItems) {
    await prisma.impactReportItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        impactReportId: impactReport.id,
      },
    });
  }

  // ── Documentation Task ─────────────────────────────────────────────────────
  const task = await prisma.documentationTask.upsert({
    where: { id: 'task-smartsync-001' },
    update: {},
    create: {
      id: 'task-smartsync-001',
      productChangeId: productChange.id,
      assigneeId: maintainer.id,
      title: 'Document Smart Sync setup and update connected repository documentation',
      description: 'The Smart Sync feature was shipped in commit a3f8c2d. Documentation must be created for the Smart Sync page and updated across Project Settings, Permissions, API Reference, Getting Started, and Changelog.',
      priority: 'high',
      status: 'in_review',
      acceptanceCriteria: JSON.stringify([
        'Smart Sync page fully documents the feature with setup instructions',
        'Frequency options (manual, hourly, daily, weekly) are listed',
        'Documentation source selection is explained',
        'project:write scope requirement is clearly stated',
        'POST /api/v1/sync endpoint is documented in API Reference',
        'Changelog includes v1.1.0 Smart Sync entry',
        'Getting Started links to Smart Sync',
        'All documentation wording matches actual product behavior (not overstated)',
        'Preview passes all validation checks before merge',
      ]),
      affectedPages: JSON.stringify(['smart-sync', 'project-settings', 'getting-started', 'permissions', 'api-reference', 'changelog']),
    },
  });

  // ── Proposal ───────────────────────────────────────────────────────────────
  // The proposal deliberately contains an overstated claim for demo purposes
  const currentContent = `# Smart Sync

> **Draft** — This page is pending review.

Smart Sync is a new feature that lets you automatically synchronize documentation with your connected repository.

*Full documentation coming soon.*`;

  const proposedContent = `# Smart Sync

Smart Sync automatically synchronizes **all project documentation** with your connected product repository, keeping everything up to date without manual intervention.

## How It Works

Thally monitors your repository for changes. When a meaningful product change is detected, Smart Sync automatically updates documentation across the board.

## Enabling Smart Sync

1. Open **Project Settings**
2. Select **Smart Sync**
3. Set a synchronization frequency
4. Click **Enable Smart Sync**

## Sync Frequency

| Frequency | Description |
|---|---|
| Manual | Sync only when you trigger it |
| Hourly | Sync every hour |
| Daily | Sync once per day |
| Weekly | Sync once per week |

## Status

The Smart Sync status indicator shows whether the last sync succeeded.

## Permissions

Smart Sync requires the \`project:write\` scope.`;

  const approvedContent = `# Smart Sync

Smart Sync lets you automatically synchronize **the documentation sources you select** with your connected product repository.

## How It Works

Thally monitors your repository for changes. When a meaningful product change is detected, Smart Sync updates the documentation sources you have selected for synchronization.

## Enabling Smart Sync

1. Open **Project Settings**
2. Select **Smart Sync**
3. Choose the documentation sources you want to synchronize
4. Select a synchronization frequency
5. Click **Enable Smart Sync**

## Documentation Source Selection

Choose which documentation areas Smart Sync should keep synchronized. Only the sources you explicitly select will be updated — other documentation areas remain unchanged.

## Sync Frequency

| Frequency | Description |
|---|---|
| Manual | Sync only when you trigger it |
| Hourly | Sync every hour |
| Daily | Sync once per day |
| Weekly | Sync once per week |

## Sync Status

The Smart Sync status indicator shows the result of the most recent synchronization and when the next sync is scheduled.

## Permissions

Smart Sync requires the \`project:write\` scope. Users with Viewer or Editor roles cannot enable Smart Sync.

## Rate Limits

Smart Sync is limited to 100 synchronizations per day per project.`;

  const proposal = await prisma.documentationProposal.upsert({
    where: { id: 'proposal-smartsync-001' },
    update: {},
    create: {
      id: 'proposal-smartsync-001',
      taskId: task.id,
      pageSlug: 'smart-sync',
      pageTitle: 'Smart Sync',
      currentContent,
      proposedContent,
      changeSummary: 'New Smart Sync documentation page generated from commit a3f8c2d analysis.',
      status: 'approved',
      analysisMode: 'demo',
      generatedAt: new Date('2026-08-18T14:30:00Z'),
    },
  });

  // ── Review ─────────────────────────────────────────────────────────────────
  await prisma.review.upsert({
    where: { id: 'review-smartsync-001' },
    update: {},
    create: {
      id: 'review-smartsync-001',
      proposalId: proposal.id,
      reviewerId: maintainer.id,
      decision: 'edited',
      comment: 'Thally\'s proposal incorrectly stated that Smart Sync synchronizes "all project documentation." This is inaccurate — the feature only synchronizes the sources the user explicitly selects. I corrected the wording throughout the page to say "the documentation sources you select." I also added the documentation source selection section that was missing, and the rate limit information.',
      editedContent: approvedContent,
      reviewedAt: new Date('2026-08-18T15:10:00Z'),
    },
  });

  // ── Preview ────────────────────────────────────────────────────────────────
  const preview = await prisma.preview.upsert({
    where: { id: 'preview-smartsync-001' },
    update: {},
    create: {
      id: 'preview-smartsync-001',
      proposalId: proposal.id,
      status: 'ready',
      previewUrl: '/preview/preview-smartsync-001',
      validationResults: JSON.stringify([
        { check: 'Markdown valid', passed: true, detail: 'All markdown parsed without errors' },
        { check: 'Internal links valid', passed: true, detail: 'All 4 internal links resolve' },
        { check: 'Navigation valid', passed: true, detail: 'Page appears in sidebar navigation' },
        { check: 'API examples valid', passed: true, detail: 'All code blocks have language specifiers' },
        { check: 'No missing pages', passed: true, detail: 'All referenced pages exist' },
        { check: 'Search index updated', passed: true, detail: '14 terms indexed from Smart Sync page' },
        { check: 'Agent context generated', passed: true, detail: '7 knowledge chunks ready for indexing' },
      ]),
    },
  });

  // ── Deployment ─────────────────────────────────────────────────────────────
  const deployment = await prisma.deployment.upsert({
    where: { id: 'deploy-smartsync-001' },
    update: {},
    create: {
      id: 'deploy-smartsync-001',
      previewId: preview.id,
      commitId: commit.id,
      status: 'ready',
      provider: 'demo',
      deploymentUrl: '/docs',
      branch: 'docs/smart-sync-update',
      docVersion: '1.1.0',
      publishedAt: new Date('2026-08-18T15:30:00Z'),
    },
  });

  // Update Smart Sync doc page to published
  await prisma.documentationPage.update({
    where: { id: 'page-smart-sync-draft' },
    data: {
      content: approvedContent,
      status: 'published',
      version: '1.1.0',
      publishedAt: new Date('2026-08-18T15:30:00Z'),
      publishedCommit: commit.sha,
    },
  });

  // ── Agent Knowledge ────────────────────────────────────────────────────────
  const agentKnowledge = await prisma.agentKnowledge.upsert({
    where: { id: 'ak-smartsync-001' },
    update: {},
    create: {
      id: 'ak-smartsync-001',
      projectId: project.id,
      knowledgeVersion: '1.1.0',
      sourceCommit: commit.sha,
      docVersion: '1.1.0',
      pagesIndexed: 8,
      chunksIndexed: 47,
      provider: 'demo',
      isActive: true,
    },
  });

  const knowledgeChunks = [
    {
      id: 'chunk-001',
      pageSlug: 'smart-sync',
      pageTitle: 'Smart Sync',
      chunkIndex: 0,
      content: 'Smart Sync lets you automatically synchronize the documentation sources you select with your connected product repository.',
    },
    {
      id: 'chunk-002',
      pageSlug: 'smart-sync',
      pageTitle: 'Smart Sync',
      chunkIndex: 1,
      content: 'To enable Smart Sync: 1. Open Project Settings. 2. Select Smart Sync. 3. Choose the documentation sources you want to synchronize. 4. Select a synchronization frequency. 5. Click Enable Smart Sync.',
    },
    {
      id: 'chunk-003',
      pageSlug: 'smart-sync',
      pageTitle: 'Smart Sync',
      chunkIndex: 2,
      content: 'Sync frequency options: Manual (sync only when you trigger it), Hourly (sync every hour), Daily (sync once per day), Weekly (sync once per week).',
    },
    {
      id: 'chunk-004',
      pageSlug: 'smart-sync',
      pageTitle: 'Smart Sync',
      chunkIndex: 3,
      content: 'Smart Sync requires the project:write scope. Users with Viewer or Editor roles cannot enable Smart Sync.',
    },
    {
      id: 'chunk-005',
      pageSlug: 'smart-sync',
      pageTitle: 'Smart Sync',
      chunkIndex: 4,
      content: 'Smart Sync is limited to 100 synchronizations per day per project.',
    },
    {
      id: 'chunk-006',
      pageSlug: 'permissions',
      pageTitle: 'Permissions',
      chunkIndex: 0,
      content: 'Smart Sync requires the project:write scope. Viewers and Editors cannot enable Smart Sync.',
    },
    {
      id: 'chunk-007',
      pageSlug: 'api-reference',
      pageTitle: 'API Reference',
      chunkIndex: 5,
      content: 'POST /v1/sync — Enable Smart Sync for a project. Requires project:write scope. Body: { projectId, sources: string[], frequency: manual|hourly|daily|weekly }.',
    },
  ];

  for (const chunk of knowledgeChunks) {
    await prisma.agentKnowledgeChunk.upsert({
      where: { id: chunk.id },
      update: {},
      create: { ...chunk, agentKnowledgeId: agentKnowledge.id },
    });
  }

  // ── Audit Events ──────────────────────────────────────────────────────────
  const auditEvents = [
    { id: 'ae-001', eventType: 'change_detected', summary: 'Product change detected: feat(sync): introduce Smart Sync', occurredAt: new Date('2026-08-18T14:25:00Z'), detail: JSON.stringify({ commitSha: 'a3f8c2d', author: 'Alex Chen' }) },
    { id: 'ae-002', eventType: 'analysis_completed', summary: 'Knowledge analysis completed — Demo Knowledge Analysis', occurredAt: new Date('2026-08-18T14:26:30Z'), detail: JSON.stringify({ mode: 'demo', areasAnalyzed: 11, affectedCount: 6 }) },
    { id: 'ae-003', eventType: 'evidence_reviewed', summary: 'Evidence reviewed: 14 evidence sources linked to change', occurredAt: new Date('2026-08-18T14:27:00Z'), detail: JSON.stringify({ evidenceCount: 14 }) },
    { id: 'ae-004', eventType: 'impact_report_generated', summary: 'Impact report generated with high confidence', occurredAt: new Date('2026-08-18T14:28:00Z'), detail: JSON.stringify({ confidence: 'high', risksCount: 4, actionsCount: 7 }) },
    { id: 'ae-005', eventType: 'task_created', summary: 'Documentation task created: Document Smart Sync setup', occurredAt: new Date('2026-08-18T14:29:00Z'), detail: JSON.stringify({ taskId: 'task-smartsync-001', priority: 'high' }) },
    { id: 'ae-006', eventType: 'proposal_generated', summary: 'Documentation proposal generated for Smart Sync page', occurredAt: new Date('2026-08-18T14:30:00Z'), detail: JSON.stringify({ proposalId: 'proposal-smartsync-001', analysisMode: 'demo' }) },
    { id: 'ae-007', eventType: 'proposal_edited', summary: 'Proposal edited by Alex Chen — corrected overstated claim', occurredAt: new Date('2026-08-18T15:10:00Z'), actorId: maintainer.id, detail: JSON.stringify({ edit: 'Changed "all project documentation" to "the documentation sources you select"', reason: 'Inaccurate — feature only syncs selected sources' }) },
    { id: 'ae-008', eventType: 'proposal_approved', summary: 'Proposal approved by Alex Chen after correction', occurredAt: new Date('2026-08-18T15:12:00Z'), actorId: maintainer.id, detail: JSON.stringify({ decision: 'edited_then_approved' }) },
    { id: 'ae-009', eventType: 'preview_generated', summary: 'Deployment preview generated — all 7 checks passed', occurredAt: new Date('2026-08-18T15:15:00Z'), detail: JSON.stringify({ checksPass: 7, checksFail: 0 }) },
    { id: 'ae-010', eventType: 'preview_reviewed', summary: 'Preview reviewed by Alex Chen — approved for merge', occurredAt: new Date('2026-08-18T15:20:00Z'), actorId: maintainer.id },
    { id: 'ae-011', eventType: 'documentation_merged', summary: 'Documentation merged to main — Smart Sync page published', occurredAt: new Date('2026-08-18T15:30:00Z'), actorId: maintainer.id, detail: JSON.stringify({ branch: 'docs/smart-sync-update', pages: ['smart-sync'] }) },
    { id: 'ae-012', eventType: 'deployment_published', summary: 'Documentation deployed — version 1.1.0 live', occurredAt: new Date('2026-08-18T15:32:00Z'), detail: JSON.stringify({ docVersion: '1.1.0', deploymentId: 'deploy-smartsync-001' }) },
    { id: 'ae-013', eventType: 'agent_knowledge_synchronized', summary: 'Agent knowledge synchronized — 47 chunks indexed from 8 pages', occurredAt: new Date('2026-08-18T15:35:00Z'), detail: JSON.stringify({ pagesIndexed: 8, chunksIndexed: 47, knowledgeVersion: '1.1.0' }) },
  ];

  for (const ae of auditEvents) {
    await prisma.auditEvent.upsert({
      where: { id: ae.id },
      update: {},
      create: {
        ...ae,
        productChangeId: productChange.id,
      },
    });
  }

  console.log('✅ Seed complete. Smart Sync demo scenario ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
