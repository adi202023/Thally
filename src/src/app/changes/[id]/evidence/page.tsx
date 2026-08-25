'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileSearch,
  Code2,
  FileCode,
  ShieldAlert,
  Terminal,
  FileText,
  Sliders,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { Drawer } from '@/components/design-system/Modal';
import { CodeBlock } from '@/components/design-system/CodeBlock';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

interface EvidenceItem {
  id: string;
  type: string;
  title: string;
  description: string;
  sourceFile?: string;
  lineStart?: number;
  lineEnd?: number;
  commitSha?: string;
  content?: string;
  whyItMatters: string;
}

export default function EvidenceExplorerPage() {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const evidenceItems: EvidenceItem[] = [
    {
      id: 'ev-001',
      type: 'commit',
      title: 'feat(sync): introduce Smart Sync',
      description: 'Primary git commit introducing automated sync functionality.',
      commitSha: 'a3f8c2d',
      whyItMatters:
        'Root cause of documentation impact. Introduces a completely new user-visible feature in the product.',
    },
    {
      id: 'ev-002',
      type: 'file',
      title: 'src/models/SmartSyncSettings.ts',
      description: 'TypeScript data model interface for sync settings.',
      sourceFile: 'src/models/SmartSyncSettings.ts',
      lineStart: 1,
      lineEnd: 42,
      content: `export interface SmartSyncSettings {
  id: string;
  projectId: string;
  enabled: boolean;
  frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  documentationSources: string[];  // selected doc slugs
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}`,
      whyItMatters:
        'Proves that Smart Sync operates on "documentationSources: string[]" (selected sources), NOT all documentation globally.',
    },
    {
      id: 'ev-003',
      type: 'api_definition',
      title: 'POST /api/v1/sync Endpoint',
      description: 'REST API endpoint with Zod validation schema.',
      sourceFile: 'src/api/v1/sync/route.ts',
      lineStart: 1,
      lineEnd: 40,
      content: `const SyncRequestSchema = z.object({
  projectId: z.string(),
  sources: z.array(z.string()).min(1, 'Select at least one documentation source'),
  frequency: z.enum(['manual', 'hourly', 'daily', 'weekly']),
});`,
      whyItMatters:
        'The Zod schema mandates min(1) selected sources, validating that users must pick specific doc targets.',
    },
    {
      id: 'ev-004',
      type: 'permission',
      title: 'requireScope(req, "project:write")',
      description: 'Role-based scope validation in API route.',
      sourceFile: 'src/api/v1/sync/route.ts',
      lineStart: 14,
      lineEnd: 14,
      content: `const user = await requireScope(req, 'project:write');`,
      whyItMatters:
        'Permissions documentation must state that Viewers and Editors cannot enable Smart Sync without the project:write scope.',
    },
    {
      id: 'ev-005',
      type: 'ui_screenshot',
      title: 'SmartSyncPanel.tsx Settings Component',
      description: 'Frontend React settings component with source picker.',
      sourceFile: 'src/settings/SmartSyncPanel.tsx',
      lineStart: 1,
      lineEnd: 30,
      content: `export function SmartSyncPanel({ project }: { project: Project }) {
  return (
    <div className="smart-sync-panel">
      <h2>Smart Sync</h2>
      <p>Automatically synchronize the documentation sources you select...</p>
      <SourceSelector sources={availableSources} selected={sources} onChange={setSources} />
      <FrequencySelector value={frequency} onChange={setFrequency} />
      <SyncStatusIndicator projectId={project.id} />
    </div>
  );
}`,
      whyItMatters:
        'UI copy confirms feature behavior: "the documentation sources you select". Direct evidence for documentation wording.',
    },
    {
      id: 'ev-006',
      type: 'test',
      title: 'tests/smartSync.test.ts',
      description: 'Automated test suite verifying selective sync behavior.',
      sourceFile: 'tests/smartSync.test.ts',
      lineStart: 1,
      lineEnd: 35,
      content: `it('only syncs selected documentation sources', async () => {
  const res = await authenticatedPOST({
    sources: ['api-reference'],
    frequency: 'weekly',
    projectId: 'p1'
  });
  const { settings } = await res.json();
  expect(settings.documentationSources).toEqual(['api-reference']);
  expect(settings.documentationSources).not.toContain('changelog');
});`,
      whyItMatters:
        'Explicit test proves unselected documentation is excluded from synchronization.',
    },
    {
      id: 'ev-007',
      type: 'changelog',
      title: 'CHANGELOG.md Entry',
      description: 'Official release notes for version 1.1.0.',
      sourceFile: 'CHANGELOG.md',
      lineStart: 5,
      lineEnd: 12,
      content: `## v1.1.0 — Smart Sync

**Smart Sync** — Automatically synchronize the documentation sources you select
with your connected product repository. Configure sync frequency and choose
which documentation areas to keep in sync.`,
      whyItMatters:
        'Official changelog entry aligns with the user-facing documentation claim.',
    },
    {
      id: 'ev-008',
      type: 'config',
      title: 'Rate Limit Configuration',
      description: 'Daily rate limit ceiling definition.',
      sourceFile: 'src/api/v1/sync/route.ts',
      lineStart: 5,
      lineEnd: 8,
      content: `// Rate limit: max 100 syncs/day per project`,
      whyItMatters:
        'Relevant constraint for API Reference and Troubleshooting documentation.',
    },
    {
      id: 'ev-009',
      type: 'existing_doc',
      title: 'Existing Doc: Getting Started',
      description: 'Current getting started guide lacks Smart Sync quickstart.',
      sourceFile: 'docs/getting-started.md',
      whyItMatters:
        'New users will miss the sync feature unless linked directly from onboarding.',
    },
    {
      id: 'ev-010',
      type: 'existing_doc',
      title: 'Existing Doc: Project Settings',
      description: 'Current settings documentation has no sync section.',
      sourceFile: 'docs/project-settings.md',
      whyItMatters:
        'Users looking for sync controls in Project Settings need navigation guidance.',
    },
    {
      id: 'ev-011',
      type: 'existing_doc',
      title: 'Existing Doc: Permissions',
      description: 'Current permissions table missing project:write for sync.',
      sourceFile: 'docs/permissions.md',
      whyItMatters:
        'Administrators need to know who has permission to trigger repository webhooks and syncs.',
    },
    {
      id: 'ev-012',
      type: 'existing_doc',
      title: 'Existing Doc: API Reference',
      description: 'Current API reference has no sync endpoints.',
      sourceFile: 'docs/api-reference.md',
      whyItMatters:
        'Developers using the REST API need request/response schema specifications.',
    },
    {
      id: 'ev-013',
      type: 'existing_doc',
      title: 'Existing Doc: Changelog',
      description: 'Current release history needs v1.1.0 update.',
      sourceFile: 'docs/changelog.md',
      whyItMatters:
        'Documentation changelog should track all published platform changes.',
    },
    {
      id: 'ev-014',
      type: 'code_snippet',
      title: 'Frequency Options Enum',
      description: 'Supported frequency interval constants.',
      sourceFile: 'src/models/SmartSyncSettings.ts',
      lineStart: 14,
      lineEnd: 20,
      content: `export const SYNC_FREQUENCY_LABELS = {
  manual: 'Manual only',
  hourly: 'Every hour',
  daily: 'Once a day',
  weekly: 'Once a week',
};`,
      whyItMatters:
        'Doc table must accurately list exactly: Manual, Hourly, Daily, Weekly.',
    },
  ];

  const filteredItems =
    filterType === 'all'
      ? evidenceItems
      : evidenceItems.filter((e) => e.type === filterType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'commit':
        return <Code2 size={16} className="text-brand" />;
      case 'api_definition':
        return <Terminal size={16} className="text-purple-600" />;
      case 'permission':
        return <ShieldAlert size={16} className="text-error" />;
      case 'test':
        return <CheckCircle2 size={16} className="text-success" />;
      default:
        return <FileCode size={16} className="text-secondary" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/changes/change-smartsync-001">Changes</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Source Evidence</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Source Evidence Explorer</h1>
            <Badge variant="brand">14 Evidence Sources</Badge>
          </div>
          <p className="page-subtitle">
            Every documentation recommendation is traceable to concrete repository code, tests, and configuration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/changes/change-smartsync-001/report">
            <Button variant="primary" size="sm" leftIcon={<Sparkles size={14} />}>
              View Impact Report →
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="evidence" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'commit', 'file', 'api_definition', 'permission', 'test', 'existing_doc', 'config'].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`btn btn-xs ${
                  filterType === type ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {type === 'all' ? 'All Sources (14)' : type.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        {/* Evidence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              hoverable
              onClick={() => setSelectedItem(item)}
              className="cursor-pointer flex flex-col justify-between"
            >
              <CardBody className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="evidence-type-icon bg-surface-2">{getIcon(item.type)}</div>
                    <Badge variant="default">{item.type.replace('_', ' ')}</Badge>
                  </div>
                  <ChevronRight size={16} className="text-tertiary" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-primary">{item.title}</h3>
                  <p className="text-xs text-secondary mt-1">{item.description}</p>
                </div>

                {item.sourceFile && (
                  <div className="font-mono text-xs text-tertiary bg-surface-1 px-2 py-1 rounded">
                    {item.sourceFile}
                    {item.lineStart && `:${item.lineStart}-${item.lineEnd}`}
                  </div>
                )}

                <div className="text-xs text-brand bg-brand-50/10 p-2 rounded border border-brand/20">
                  <span className="font-semibold block mb-0.5">Why this matters:</span>
                  {item.whyItMatters}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Evidence Detail Drawer */}
        <Drawer
          isOpen={selectedItem !== null}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.title || 'Evidence Detail'}
          size="xl"
          footer={
            <Button variant="secondary" onClick={() => setSelectedItem(null)}>
              Close
            </Button>
          }
        >
          {selectedItem && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <Badge variant="brand">{selectedItem.type.toUpperCase()}</Badge>
                {selectedItem.sourceFile && (
                  <span className="font-mono text-xs text-secondary">
                    {selectedItem.sourceFile}
                    {selectedItem.lineStart && ` (lines ${selectedItem.lineStart}-${selectedItem.lineEnd})`}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-1">
                  Description
                </h4>
                <p className="text-sm text-primary">{selectedItem.description}</p>
              </div>

              <div className="p-4 bg-brand-50 border border-brand-200 rounded-lg">
                <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-1">
                  Why This Matters for Documentation
                </h4>
                <p className="text-sm text-brand-900 leading-relaxed">{selectedItem.whyItMatters}</p>
              </div>

              {selectedItem.content && (
                <div>
                  <h4 className="text-xs font-semibold text-tertiary uppercase tracking-wider mb-2">
                    Source Code / Definition Snippet
                  </h4>
                  <CodeBlock
                    code={selectedItem.content}
                    language={selectedItem.sourceFile?.endsWith('.ts') || selectedItem.sourceFile?.endsWith('.tsx') ? 'typescript' : 'markdown'}
                  />
                </div>
              )}
            </div>
          )}
        </Drawer>
      </main>
    </div>
  );
}
