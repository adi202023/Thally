'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  GitCommit,
  Sparkles,
  FileSearch,
  CheckSquare,
  FileEdit,
  UserCheck,
  Eye,
  GitMerge,
  BookOpen,
  Bot,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';

export default function VerificationPage() {
  const chainSteps = [
    { label: '1. Product Change', sub: 'feat(sync): introduce Smart Sync (a3f8c2d)', done: true },
    { label: '2. Impact Analysis', sub: '10 areas evaluated, 6 definitely affected', done: true },
    { label: '3. Source Evidence', sub: '14 code snippets, tests & schemas linked', done: true },
    { label: '4. Documentation Task', sub: 'Task #247 with 9 acceptance criteria', done: true },
    { label: '5. Proposed Update', sub: 'Draft generated for /docs/smart-sync', done: true },
    { label: '6. Human Review', sub: 'Maintainer corrected overstated claim', done: true },
    { label: '7. Deployment Preview', sub: '7/7 validation checks verified on /preview', done: true },
    { label: '8. Merge Gate', sub: 'Gated merge approved by Alex Chen', done: true },
    { label: '9. Published Docs', sub: 'v1.1.0 live on /docs portal', done: true },
    { label: '10. Agent Knowledge', sub: '47 chunks indexed with verified citations', done: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Final Verification</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Documentation Change Verified</h1>
            <Badge variant="success" dot>End-to-End Workflow Complete</Badge>
            <Badge variant="brand">10/10 Stages Verified</Badge>
          </div>
          <p className="page-subtitle">
            Complete traceability audit and post-publication verification report for the Smart Sync feature release.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/docs/smart-sync">
            <Button variant="secondary" size="sm" leftIcon={<BookOpen size={14} />}>
              Open Published Docs
            </Button>
          </Link>
          <Link href="/agent">
            <Button variant="primary" size="sm" leftIcon={<Bot size={14} />}>
              Query Agent Knowledge →
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        {/* End-to-End Workflow Chain Visualizer */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-success" />
              <CardTitle>End-to-End Provenance Chain (100% Verified)</CardTitle>
            </div>
            <span className="text-xs text-success font-semibold">ALL STAGES COMPLETE ✓</span>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {chainSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-surface-1 border border-success/30 rounded-lg flex flex-col gap-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{step.label}</span>
                    <CheckCircle2 size={14} className="text-success" />
                  </div>
                  <span className="text-secondary leading-snug">{step.sub}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 3 Critical Engineering Verification Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. What Thally Understood Correctly */}
          <Card className="border-t-4 border-t-success">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-success" />
                <CardTitle>What Thally Understood Correctly</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="text-xs text-secondary leading-relaxed flex flex-col gap-3">
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Identified User-Visible Scope</span>
                Correctly recognized that commit <code>a3f8c2d</code> introduces a new user-visible configuration interface in settings.
              </div>
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Discovered Settings Impact</span>
                Flagged <code>Project Settings</code> as definitely affected due to the addition of <code>SmartSyncPanel.tsx</code>.
              </div>
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Detected API Endpoints</span>
                Identified the new <code>POST /api/v1/sync</code> endpoint, Zod body schema, and 100 syncs/day rate limit.
              </div>
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Scoped Permissions Logic</span>
                Recognized <code>requireScope(req, &apos;project:write&apos;)</code> and flagged Permissions documentation.
              </div>
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Connected Repository Evidence</span>
                Traceably indexed 14 discrete evidence items from git diff, tests, and models.
              </div>
            </CardBody>
          </Card>

          {/* 2. What Thally Missed or Overstated */}
          <Card className="border-t-4 border-t-warning">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-warning" />
                <CardTitle>What Thally Missed or Overstated</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="text-xs text-secondary leading-relaxed flex flex-col gap-3">
              <div className="p-2.5 bg-warning-50 border border-warning-200 rounded text-warning-900">
                <span className="font-bold block mb-0.5">Overstated Feature Claim</span>
                The automated proposal initially claimed: <em>&quot;Smart Sync automatically synchronizes all project documentation.&quot;</em>
                <br /><br />
                <strong>Reality:</strong> The feature only synchronizes the specific documentation sources explicitly chosen by the user.
              </div>
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Over-Flagged FAQ Section</span>
                Flagged FAQ as possibly affected even though no mandatory question update was required for initial release.
              </div>
              <div className="p-2.5 bg-surface-1 rounded border border-subtle">
                <span className="font-bold text-primary block mb-0.5">Omitted Rate Limit in Initial Draft</span>
                The initial draft omitted the 100 syncs/day rate limit ceiling that was present in the API middleware.
              </div>
            </CardBody>
          </Card>

          {/* 3. What the Maintainer Verified Manually */}
          <Card className="border-t-4 border-t-brand">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-brand" />
                <CardTitle>What the Maintainer Verified Manually</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="text-xs text-secondary leading-relaxed flex flex-col gap-2">
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Verified that Smart Sync only runs for explicitly selected sources.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Tested that users without <code>project:write</code> cannot enable Smart Sync.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Corrected documentation wording from &quot;all docs&quot; to &quot;selected sources&quot;.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Validated REST API examples and curl requests in API Reference.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Inspected <code>/preview/preview-smartsync-001</code> layout and cross-links.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Confirmed live publication on <code>/docs/smart-sync</code> after merge.</span>
              </div>
              <div className="flex items-start gap-2 p-2 bg-surface-1 rounded">
                <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                <span>Tested Agent queries to verify citations match the approved documentation.</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
