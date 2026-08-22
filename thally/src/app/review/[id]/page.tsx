'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  UserCheck,
  CheckCircle2,
  XCircle,
  Edit3,
  AlertTriangle,
  Sparkles,
  Eye,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { Tabs } from '@/components/design-system/Tabs';
import { Modal } from '@/components/design-system/Modal';
import { DiffViewer } from '@/components/design-system/DiffViewer';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

export default function ProposalReviewPage() {
  const router = useRouter();

  const initialProposedContent = `# Smart Sync

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

  const currentVersionContent = `# Smart Sync

> **Draft** — This page is pending review.

Smart Sync is a new feature that lets you automatically synchronize documentation with your connected repository.

*Full documentation coming soon.*`;

  const [content, setContent] = useState(approvedContent);
  const [hasEdited, setHasEdited] = useState(true);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');

  const handleFixOverstatedClaim = () => {
    setContent(approvedContent);
    setHasEdited(true);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await fetch('/api/proposals/proposal-smartsync-001/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actorId: 'alex@thally.dev',
          comment: 'Approved after correcting overstated synchronization claim.',
        }),
      });
      setStatus('approved');
      router.push('/preview/preview-smartsync-001');
    } catch (e) {
      console.error(e);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    await fetch('/api/proposals/proposal-smartsync-001/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actorId: 'alex@thally.dev', reason: rejectReason }),
    });
    setStatus('rejected');
    setIsRejectModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/changes/change-smartsync-001/task">Task #247</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Proposal Review</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Human-in-the-Loop Proposal Review</h1>
            <Badge variant="purple">Demo Knowledge Analysis</Badge>
            <Badge variant={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning'}>
              {status === 'approved' ? 'Approved by Maintainer' : status === 'rejected' ? 'Rejected' : 'Pending Review'}
            </Badge>
          </div>
          <p className="page-subtitle">
            Review, edit, or reject proposed documentation updates before generating a deployment preview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRejectModalOpen(true)}
            leftIcon={<XCircle size={14} className="text-error" />}
          >
            Reject Proposal
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isApproving}
            onClick={handleApprove}
            leftIcon={<CheckCircle2 size={14} />}
            rightIcon={<ArrowRight size={14} />}
          >
            Approve & Generate Preview
          </Button>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="review" />
        </div>

        {/* Human-in-the-Loop Overstated Claim Callout */}
        <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg flex items-start gap-3">
          <ShieldAlert size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-warning-900 leading-relaxed">
            <div className="font-bold text-sm text-warning-900 mb-1 flex items-center gap-2">
              <span>Why Human-in-the-Loop Verification Matters</span>
              <Badge variant="warning">Critical Check</Badge>
            </div>
            <p className="mb-2">
              The automated proposal initially claimed: <em>&quot;Smart Sync automatically synchronizes <strong>all project documentation</strong>.&quot;</em>
              {' '}However, repository source evidence (<code>SmartSyncSettings.ts</code> and <code>smartSync.test.ts</code>) confirms that
              only user-selected sources are synchronized.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Maintainer action applied:</span>
              <span className="bg-white/80 px-2 py-0.5 rounded border border-warning-300 font-medium">
                Corrected wording to: &quot;the documentation sources you select&quot; + added Source Selection and Rate Limit sections.
              </span>
              <button
                onClick={handleFixOverstatedClaim}
                className="btn btn-xs btn-secondary ml-auto"
              >
                Reset to Corrected Version
              </button>
            </div>
          </div>
        </div>

        {/* Diff & Editor Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Documentation Content Review & Diff</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-tertiary">Target slug:</span>
              <code className="text-xs font-mono bg-surface-2 px-2 py-0.5 rounded">docs/smart-sync.md</code>
            </div>
          </CardHeader>
          <CardBody>
            <Tabs
              tabs={[
                {
                  id: 'diff',
                  label: 'Side-by-Side Diff',
                  icon: <FileText size={14} />,
                  content: (
                    <div className="flex flex-col gap-4">
                      <DiffViewer
                        oldText={currentVersionContent}
                        newText={content}
                        oldTitle="Current Version (Draft)"
                        newTitle="Proposed Version (Corrected by Maintainer)"
                      />
                    </div>
                  ),
                },
                {
                  id: 'editor',
                  label: 'Live Markdown Editor',
                  icon: <Edit3 size={14} />,
                  content: (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-tertiary uppercase">
                          Markdown Source (Direct Edit)
                        </label>
                        <textarea
                          className="form-input form-textarea font-mono text-xs leading-relaxed h-[420px]"
                          value={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                            setHasEdited(true);
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-tertiary uppercase">
                          Live Render Preview
                        </label>
                        <div className="p-4 bg-surface-1 border border-subtle rounded-lg h-[420px] overflow-y-auto docs-prose text-xs">
                          <div dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(content) }} />
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'original',
                  label: 'Raw AI Initial Proposal',
                  icon: <Sparkles size={14} />,
                  content: (
                    <div className="flex flex-col gap-3">
                      <div className="p-3 bg-surface-1 rounded border border-subtle text-xs text-secondary">
                        This was the uncorrected initial output before maintainer review. Notice line 3 contains the overstated claim.
                      </div>
                      <pre className="p-4 bg-surface-2 font-mono text-xs text-primary rounded leading-relaxed overflow-x-auto">
                        {initialProposedContent}
                      </pre>
                    </div>
                  ),
                },
              ]}
            />
          </CardBody>
        </Card>
      </main>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Documentation Proposal"
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} disabled={!rejectReason}>
              Confirm Rejection
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-xs text-secondary">
            Provide an explicit reason for rejecting this proposal. This will be recorded in the immutable audit trail.
          </p>
          <textarea
            className="form-input form-textarea text-xs"
            placeholder="e.g., Feature scope changed, needs complete rewrite..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

function renderSimpleMarkdown(md: string): string {
  return md
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mb-2">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-md font-bold mt-4 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/`(.*?)`/gim, '<code class="bg-gray-200 px-1 rounded font-mono">$1</code>')
    .replace(/\n\n/gim, '<br/><br/>');
}
