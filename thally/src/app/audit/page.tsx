'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
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
  ShieldAlert,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';

interface AuditItem {
  id: string;
  eventType: string;
  summary: string;
  occurredAt: string;
  actor: string;
  detail?: string;
  iconType: string;
}

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const auditEvents: AuditItem[] = [
    {
      id: 'ae-013',
      eventType: 'agent_knowledge_synchronized',
      summary: 'Agent knowledge synchronized — 47 chunks indexed from 8 pages',
      occurredAt: 'Today, 15:35 UTC',
      actor: 'System (Thally Agent Indexer)',
      detail: 'Re-indexed knowledge embeddings after version 1.1.0 publication.',
      iconType: 'bot',
    },
    {
      id: 'ae-012',
      eventType: 'deployment_published',
      summary: 'Documentation deployed — version 1.1.0 live on /docs',
      occurredAt: 'Today, 15:32 UTC',
      actor: 'System (Demo Deployment Provider)',
      detail: 'Created deployment #deploy-smartsync-001 targeting production documentation.',
      iconType: 'book',
    },
    {
      id: 'ae-011',
      eventType: 'documentation_merged',
      summary: 'Documentation merged — Smart Sync page published',
      occurredAt: 'Today, 15:30 UTC',
      actor: 'Alex Chen (Maintainer)',
      detail: 'Merged branch docs/smart-sync-update into main following validation passing.',
      iconType: 'merge',
    },
    {
      id: 'ae-010',
      eventType: 'preview_reviewed',
      summary: 'Preview reviewed by Alex Chen — approved for merge',
      occurredAt: 'Today, 15:20 UTC',
      actor: 'Alex Chen (Maintainer)',
      detail: 'Verified layout rendering and cross-links on preview route.',
      iconType: 'preview',
    },
    {
      id: 'ae-009',
      eventType: 'preview_generated',
      summary: 'Deployment preview generated — all 7 checks passed',
      occurredAt: 'Today, 15:15 UTC',
      actor: 'System (Preview Engine)',
      detail: 'Automated validation checks passed without errors.',
      iconType: 'preview',
    },
    {
      id: 'ae-008',
      eventType: 'proposal_approved',
      summary: 'Proposal approved by Alex Chen after correction',
      occurredAt: 'Today, 15:12 UTC',
      actor: 'Alex Chen (Maintainer)',
      detail: 'Human review approval recorded for proposal #proposal-smartsync-001.',
      iconType: 'check',
    },
    {
      id: 'ae-007',
      eventType: 'proposal_edited',
      summary: 'Proposal edited by Alex Chen — corrected overstated claim',
      occurredAt: 'Today, 15:10 UTC',
      actor: 'Alex Chen (Maintainer)',
      detail: 'Changed "all project documentation" to "the documentation sources you select". Added rate limits.',
      iconType: 'edit',
    },
    {
      id: 'ae-006',
      eventType: 'proposal_generated',
      summary: 'Documentation proposal generated for Smart Sync page',
      occurredAt: 'Today, 14:30 UTC',
      actor: 'System (Knowledge Engine)',
      detail: 'Generated initial markdown content for task #task-smartsync-001.',
      iconType: 'doc',
    },
    {
      id: 'ae-005',
      eventType: 'task_created',
      summary: 'Documentation task created: Document Smart Sync setup',
      occurredAt: 'Today, 14:29 UTC',
      actor: 'System (Task Dispatcher)',
      detail: 'Assigned to Alex Chen with High priority.',
      iconType: 'task',
    },
    {
      id: 'ae-004',
      eventType: 'impact_report_generated',
      summary: 'Impact report generated with High confidence',
      occurredAt: 'Today, 14:28 UTC',
      actor: 'System (Analysis Service)',
      detail: 'Identified 6 definitely affected areas, 1 possibly affected, and 3 unaffected.',
      iconType: 'sparkles',
    },
    {
      id: 'ae-003',
      eventType: 'evidence_reviewed',
      summary: 'Evidence reviewed: 14 evidence sources linked to change',
      occurredAt: 'Today, 14:27 UTC',
      actor: 'System (Evidence Crawler)',
      detail: 'Indexed commits, AST definitions, Zod schemas, tests, and screenshots.',
      iconType: 'evidence',
    },
    {
      id: 'ae-002',
      eventType: 'analysis_completed',
      summary: 'Knowledge analysis completed — Demo Knowledge Analysis',
      occurredAt: 'Today, 14:26 UTC',
      actor: 'System (Deterministic Engine)',
      detail: 'Evaluated commit diff across 10 knowledge domains in 1.2s.',
      iconType: 'sparkles',
    },
    {
      id: 'ae-001',
      eventType: 'change_detected',
      summary: 'Product change detected: feat(sync): introduce Smart Sync',
      occurredAt: 'Today, 14:25 UTC',
      actor: 'System (Repository Webhook)',
      detail: 'Commit a3f8c2d received on branch feat/smart-sync.',
      iconType: 'commit',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'bot':
        return <Bot size={14} />;
      case 'book':
        return <BookOpen size={14} />;
      case 'merge':
        return <GitMerge size={14} />;
      case 'preview':
        return <Eye size={14} />;
      case 'check':
        return <UserCheck size={14} />;
      case 'edit':
        return <FileEdit size={14} />;
      case 'doc':
        return <FileSearch size={14} />;
      case 'task':
        return <CheckSquare size={14} />;
      case 'sparkles':
        return <Sparkles size={14} />;
      case 'commit':
        return <GitCommit size={14} />;
      default:
        return <History size={14} />;
    }
  };

  const getIconVariant = (type: string) => {
    switch (type) {
      case 'bot':
        return 'purple';
      case 'book':
      case 'merge':
      case 'check':
        return 'success';
      case 'edit':
      case 'commit':
        return 'brand';
      case 'sparkles':
        return 'info';
      default:
        return 'default';
    }
  };

  const filtered = auditEvents.filter(
    (e) =>
      e.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Audit Trail</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Immutable Audit Log</h1>
            <Badge variant="brand">13 Recorded Events</Badge>
            <Badge variant="success">Integrity Verified</Badge>
          </div>
          <p className="page-subtitle">
            Complete cryptographic audit trail of all actions from initial change detection to final agent synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/verification">
            <Button variant="primary" size="sm">
              Verification Report →
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        {/* Search */}
        <div className="flex items-center gap-3 p-3 bg-surface-0 border border-subtle rounded-lg">
          <Search size={16} className="text-tertiary ml-2" />
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-xs text-primary"
            placeholder="Filter audit events by action, actor, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Audit Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Event Timeline ({filtered.length} events)</CardTitle>
            <span className="text-xs text-tertiary">Chronological Order (Newest First)</span>
          </CardHeader>
          <CardBody>
            <div className="timeline">
              {filtered.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className={`timeline-icon ${getIconVariant(item.iconType)}`}>
                    {getIcon(item.iconType)}
                  </div>
                  <div className="timeline-content">
                    <div className="flex items-center justify-between gap-2">
                      <div className="timeline-title">{item.summary}</div>
                      <span className="timeline-time">{item.occurredAt}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default">{item.eventType}</Badge>
                      <span className="text-xs text-tertiary">Actor: {item.actor}</span>
                    </div>
                    {item.detail && (
                      <div className="timeline-detail">{item.detail}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
