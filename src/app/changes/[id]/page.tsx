'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  GitCommit,
  Sparkles,
  FileSearch,
  FileText,
  CheckCircle2,
  Calendar,
  User,
  GitBranch,
  FileCode,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { CodeBlock } from '@/components/design-system/CodeBlock';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

export default function ChangeDetailPage() {
  const params = useParams();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const changedFiles = [
    { path: 'src/models/SmartSyncSettings.ts', additions: 42, deletions: 0, status: 'added' },
    { path: 'src/api/v1/sync/route.ts', additions: 89, deletions: 0, status: 'added' },
    { path: 'src/settings/SmartSyncPanel.tsx', additions: 124, deletions: 0, status: 'added' },
    { path: 'tests/smartSync.test.ts', additions: 67, deletions: 0, status: 'added' },
    { path: 'src/lib/auth/scopes.ts', additions: 8, deletions: 2, status: 'modified' },
    { path: 'src/lib/rateLimiter.ts', additions: 15, deletions: 5, status: 'modified' },
    { path: 'CHANGELOG.md', additions: 12, deletions: 0, status: 'modified' },
    { path: 'package.json', additions: 2, deletions: 1, status: 'modified' },
  ];

  const rawDiff = `diff --git a/src/models/SmartSyncSettings.ts b/src/models/SmartSyncSettings.ts
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
+};`;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await fetch('/api/changes/change-smartsync-001/analyze', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
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
            <span className="text-primary font-medium">Smart Sync</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Smart Sync — Product Change</h1>
            <Badge variant="success" dot>Published</Badge>
            <Badge variant="purple">Demo Mode</Badge>
          </div>
          <p className="page-subtitle">
            Detected commit <code>a3f8c2d</code> on branch <code>feat/smart-sync</code>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/changes/change-smartsync-001/evidence">
            <Button variant="secondary" size="sm" leftIcon={<FileSearch size={14} />}>
              Evidence Explorer (14)
            </Button>
          </Link>
          <Link href="/changes/change-smartsync-001/report">
            <Button variant="primary" size="sm" leftIcon={<Sparkles size={14} />}>
              Impact Report
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        {/* Pipeline Bar */}
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="change" />
        </div>

        {/* Change Metadata Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <GitCommit size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Commit SHA</span>
                <span className="font-mono font-semibold text-sm">a3f8c2d1e9b4</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <User size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Author</span>
                <span className="font-semibold text-sm">Alex Chen</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <Calendar size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Detected At</span>
                <span className="font-semibold text-sm">Today, 14:25 UTC</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <FileCode size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Diff Statistics</span>
                <span className="font-semibold text-sm text-success">+847</span>{' '}
                <span className="font-semibold text-sm text-error">-12</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Commit Message & Scope */}
        <Card>
          <CardHeader>
            <CardTitle>Commit Message & Context</CardTitle>
            <Badge variant="brand">feat(sync)</Badge>
          </CardHeader>
          <CardBody>
            <pre className="p-4 bg-surface-1 rounded border border-subtle font-mono text-xs leading-relaxed text-primary">
{`feat(sync): introduce Smart Sync for connected documentation

Adds the Smart Sync feature that lets users automatically synchronize
selected documentation sources with their connected product repository.

Changes:
- Add SmartSyncSettings model and migrations
- Add /api/v1/sync endpoint with JWT auth
- Add sync frequency options (manual, hourly, daily, weekly)
- Add documentation source selection UI
- Add sync status indicators
- Add permission checks (requires project:write scope)
- Add rate limiting (max 100 syncs/day)
- Add audit logging for all sync events

Breaking: None
Migration: Required

Closes #247
Reviewed-by: Jordan Kim <jordan@thally.dev>`}
            </pre>
          </CardBody>
        </Card>

        {/* Changed Files Table */}
        <Card>
          <CardHeader>
            <CardTitle>Changed Files (18 files)</CardTitle>
            <span className="text-xs text-tertiary">Repository provider: Mock (Demo)</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-wrapper border-0 rounded-none">
              <table>
                <thead>
                  <tr>
                    <th>File Path</th>
                    <th>Status</th>
                    <th>Additions</th>
                    <th>Deletions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {changedFiles.map((file) => (
                    <tr key={file.path}>
                      <td className="font-mono text-xs font-medium">{file.path}</td>
                      <td>
                        <Badge variant={file.status === 'added' ? 'success' : 'brand'}>
                          {file.status}
                        </Badge>
                      </td>
                      <td className="text-xs text-success font-mono">+{file.additions}</td>
                      <td className="text-xs text-error font-mono">-{file.deletions}</td>
                      <td>
                        <Link
                          href="/changes/change-smartsync-001/evidence"
                          className="text-xs text-brand hover:underline"
                        >
                          View Evidence →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Diff Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Diff Preview</CardTitle>
            <span className="text-xs text-tertiary font-mono">SmartSyncSettings.ts</span>
          </CardHeader>
          <CardBody className="p-0">
            <CodeBlock code={rawDiff} language="diff" />
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
