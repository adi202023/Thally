'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  User,
  Calendar,
  Layers,
  ArrowRight,
  GitCommit,
  Sparkles,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

export default function DocumentationTaskPage() {
  const criteria = [
    'Smart Sync page fully documents the feature with step-by-step setup instructions',
    'Frequency options (manual, hourly, daily, weekly) are enumerated and explained',
    'Documentation source selection is clearly explained (selective sync, not all docs)',
    'project:write scope requirement is explicitly stated in Permissions & Smart Sync docs',
    'POST /api/v1/sync endpoint is documented in API Reference with request/response schema',
    'Changelog includes v1.1.0 Smart Sync release notes',
    'Getting Started quickstart links directly to Smart Sync',
    'All documentation claims accurately mirror product code (no overstated synchronization claims)',
    'Preview passes all 7 validation checks before merge gate is unlocked',
  ];

  const affectedPages = [
    { slug: 'smart-sync', title: 'Smart Sync', status: 'Primary Target' },
    { slug: 'project-settings', title: 'Project Settings', status: 'Section Update' },
    { slug: 'getting-started', title: 'Getting Started', status: 'Link Addition' },
    { slug: 'permissions', title: 'Permissions', status: 'Scope Addition' },
    { slug: 'api-reference', title: 'API Reference', status: 'Endpoint Addition' },
    { slug: 'changelog', title: 'Changelog', status: 'Release Notes' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <Link href="/changes/change-smartsync-001">Changes</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Documentation Task</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Documentation Task #247</h1>
            <Badge variant="brand">Priority: High</Badge>
            <Badge variant="success">Status: In Review</Badge>
          </div>
          <p className="page-subtitle">
            Document Smart Sync setup and update connected repository documentation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/review/proposal-smartsync-001">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Begin Human Review & Editor →
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="task" />
        </div>

        {/* Task Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <User size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Assignee</span>
                <span className="font-semibold text-sm">Alex Chen (Maintainer)</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Created</span>
                <span className="font-semibold text-sm">Today, 14:29 UTC</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <GitCommit size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Source Commit</span>
                <span className="font-mono font-semibold text-sm">a3f8c2d</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <Layers size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Target Pages</span>
                <span className="font-semibold text-sm">6 Pages</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Task Description & Affected Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Objectives & Scope</CardTitle>
            </CardHeader>
            <CardBody className="text-sm text-secondary leading-relaxed flex flex-col gap-3">
              <p>
                The Smart Sync feature introduces repository documentation synchronization capabilities into Thally.
                A complete documentation guide must be published on <code>/docs/smart-sync</code> and associated
                references updated across Project Settings, Permissions, API Reference, Getting Started, and Changelog.
              </p>
              <div className="p-3 bg-brand-50 border border-brand-200 rounded text-xs text-brand-900 leading-relaxed">
                <strong>Human-in-the-loop requirement:</strong> Maintainers must verify all generated claims against
                source evidence before approving the proposal for preview and merge.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Target Documentation Pages</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-wrapper border-0 rounded-none">
                <table>
                  <thead>
                    <tr>
                      <th>Page Title</th>
                      <th>Slug</th>
                      <th>Update Scope</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectedPages.map((page) => (
                      <tr key={page.slug}>
                        <td className="font-medium text-primary">{page.title}</td>
                        <td className="font-mono text-xs text-tertiary">/docs/{page.slug}</td>
                        <td>
                          <Badge variant="brand">{page.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Acceptance Criteria */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-success" />
              <CardTitle>Acceptance Criteria (Gated Checklist)</CardTitle>
            </div>
            <span className="text-xs text-tertiary">9 criteria verified</span>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {criteria.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 bg-surface-1 border border-subtle rounded text-xs text-secondary"
                >
                  <ShieldCheck size={14} className="text-success mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
