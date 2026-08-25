'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  CheckCircle2,
  GitMerge,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  GitCommit,
  Check,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

export default function DeploymentPreviewPage() {
  const router = useRouter();
  const [isMerging, setIsMerging] = useState(false);
  const [isMerged, setIsMerged] = useState(true);

  const checks = [
    { check: 'Markdown valid', passed: true, detail: 'All markdown tokens and tables parsed without syntax errors.' },
    { check: 'Internal links valid', passed: true, detail: 'All 4 cross-page links resolve to active doc routes.' },
    { check: 'Navigation valid', passed: true, detail: 'Smart Sync page is registered in the sidebar hierarchy.' },
    { check: 'API examples valid', passed: true, detail: 'All code snippets include valid language tags and schema.' },
    { check: 'No missing pages', passed: true, detail: 'No broken references to uncreated knowledge areas.' },
    { check: 'Search index updated', passed: true, detail: '14 key terms and synonyms indexed from Smart Sync page.' },
    { check: 'Agent context generated', passed: true, detail: '7 structured knowledge chunks prepared for Agent sync.' },
  ];

  const handleMerge = async () => {
    setIsMerging(true);
    try {
      await fetch('/api/previews/preview-smartsync-001/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actorId: 'alex@thally.dev' }),
      });
      setIsMerged(true);
      router.push('/docs/smart-sync');
    } catch (e) {
      console.error(e);
    } finally {
      setIsMerging(false);
    }
  };

  const previewDocContent = `# Smart Sync

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

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/review/proposal-smartsync-001">Review</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Deployment Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Deployment Preview #preview-smartsync-001</h1>
            <Badge variant="success" dot>7 / 7 Checks Passed</Badge>
            <Badge variant="brand">Gated Merge Ready</Badge>
          </div>
          <p className="page-subtitle">
            Isolated deployment preview verified against all documentation validation rules before production publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/docs/smart-sync">
            <Button variant="secondary" size="sm" leftIcon={<BookOpen size={14} />}>
              View Live Docs Page
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            isLoading={isMerging}
            onClick={handleMerge}
            leftIcon={<GitMerge size={14} />}
            rightIcon={<ArrowRight size={14} />}
          >
            {isMerged ? 'Re-Publish to Live Docs' : 'Merge & Publish to Live Docs'}
          </Button>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="preview" />
        </div>

        {/* Validation Checks Banner */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-success" />
              <CardTitle>Automated Preview Validation Checks (7/7 Passed)</CardTitle>
            </div>
            <span className="text-xs text-success font-semibold">Merge Gate: UNLOCKED ✓</span>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {checks.map((c, i) => (
                <div
                  key={i}
                  className="p-3 bg-surface-1 border border-success/30 rounded-lg flex items-start gap-2 text-xs"
                >
                  <CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-primary">{c.check}</div>
                    <div className="text-secondary mt-0.5 leading-relaxed">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Visual Preview Frame */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-brand" />
              <CardTitle>Visual Documentation Preview: /docs/smart-sync</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="brand">Version 1.1.0 Preview</Badge>
              <Badge variant="default">Branch: docs/smart-sync-update</Badge>
            </div>
          </CardHeader>
          <CardBody className="bg-surface-1">
            <div className="max-w-3xl mx-auto p-6 bg-surface-0 border border-subtle rounded-xl docs-prose text-xs shadow-sm">
              <div className="p-3 mb-6 bg-brand-50 border border-brand-200 rounded text-brand-900 text-xs flex items-center justify-between">
                <span>Preview Mode — This shows how the page renders on the live documentation portal.</span>
                <Badge variant="success">Verified</Badge>
              </div>
              <div dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(previewDocContent) }} />
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}

function renderSimpleMarkdown(md: string): string {
  return md
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-3 text-primary">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-6 mb-2 border-t pt-4 text-primary">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded font-mono text-brand">$1</code>')
    .replace(/\n\n/gim, '<br/><br/>');
}
