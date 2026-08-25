'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  FileText,
  Layers,
  FileSearch,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

export default function ImpactReportPage() {
  const affectedAreas = [
    {
      name: 'Smart Sync',
      status: 'definitely',
      confidence: 'high',
      reasoning:
        'Smart Sync is an entirely new knowledge area with zero existing coverage. Requires complete setup, frequency options, and source selector guide.',
      pages: ['smart-sync'],
    },
    {
      name: 'Project Settings',
      status: 'definitely',
      confidence: 'high',
      reasoning:
        'Smart Sync is configured inside Project Settings. The SmartSyncPanel component was added to settings UI. Current settings docs do not reflect this.',
      pages: ['project-settings'],
    },
    {
      name: 'Getting Started',
      status: 'definitely',
      confidence: 'high',
      reasoning:
        'Primary onboarding quickstart must link to Smart Sync as a new platform feature so new users discover automated sync capabilities.',
      pages: ['getting-started'],
    },
    {
      name: 'Permissions',
      status: 'definitely',
      confidence: 'high',
      reasoning:
        'Smart Sync API route requires project:write scope. Permissions reference table must explicitly document who can enable and configure synchronization.',
      pages: ['permissions'],
    },
    {
      name: 'API Reference',
      status: 'definitely',
      confidence: 'high',
      reasoning:
        'New POST /api/v1/sync endpoint added with JSON body validation schema and rate limits (100 syncs/day). Needs full REST endpoint documentation.',
      pages: ['api-reference'],
    },
    {
      name: 'Changelog',
      status: 'definitely',
      confidence: 'high',
      reasoning:
        'Official v1.1.0 release entry must be recorded in docs changelog with complete feature highlights and breaking changes notes.',
      pages: ['changelog'],
    },
    {
      name: 'FAQ',
      status: 'possibly',
      confidence: 'medium',
      reasoning:
        'Users might query whether Smart Sync pushes all repository documentation automatically. An optional FAQ entry clarifying selective sync is recommended.',
      pages: ['faq'],
    },
    {
      name: 'Billing',
      status: 'unaffected',
      confidence: 'high',
      reasoning:
        'Smart Sync is included across all plan tiers in this release. Billing plans remain unchanged.',
      pages: ['billing'],
    },
    {
      name: 'Teams',
      status: 'unaffected',
      confidence: 'high',
      reasoning:
        'Smart Sync permissions are project-scoped, not organization or team-scoped. Team management docs unaffected.',
      pages: ['teams'],
    },
    {
      name: 'Security Overview',
      status: 'unaffected',
      confidence: 'high',
      reasoning:
        'Reuses existing OAuth tokens and JWT scope verification. No new encryption or auth mechanisms introduced.',
      pages: ['security'],
    },
  ];

  const risks = [
    'Claiming Smart Sync synchronizes "all" documentation would be inaccurate and misleading — only user-selected documentation sources are synced.',
    'Omitting the project:write scope requirement would leave Viewers and Editors confused when settings actions are disabled.',
    'Failing to document the 100 syncs/day rate limit could trigger unexpected API rate-limit errors for high-volume automated scripts.',
    'Leaving Getting Started without a Smart Sync reference creates a feature discovery gap for newly onboarded teams.',
  ];

  const recommendations = [
    'Generate a dedicated Smart Sync documentation page explaining configuration, frequency options, and source selection.',
    'Update Project Settings guide to include the Smart Sync configuration section.',
    'Update Permissions page to document the project:write scope requirement.',
    'Update API Reference to document POST /api/v1/sync with request and response examples.',
    'Publish v1.1.0 release notes in the public documentation Changelog.',
    'Link to Smart Sync from the Getting Started quickstart guide.',
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
            <span className="text-primary font-medium">Impact Report</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Knowledge Impact Report</h1>
            <Badge variant="purple">Demo Knowledge Analysis</Badge>
            <Badge variant="success">Confidence: High</Badge>
          </div>
          <p className="page-subtitle">
            Comprehensive engineering analysis of repository commit <code>a3f8c2d</code> across 10 knowledge areas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/changes/change-smartsync-001/task">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
              Open Documentation Task
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="analysis" />
        </div>

        {/* Change & User Impact Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand" />
                <CardTitle>Change Summary</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="text-sm text-secondary leading-relaxed flex flex-col gap-2">
              <p>
                The Smart Sync feature introduces user-configurable automated synchronization between connected
                product repositories and documentation sources. Users can select specific documentation areas to keep
                synchronized and configure sync intervals (manual, hourly, daily, weekly).
              </p>
              <p>
                The feature introduces a new REST API endpoint <code>POST /api/v1/sync</code> with Zod schema validation
                and requires the <code>project:write</code> permission scope.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                <CardTitle>User Impact</CardTitle>
              </div>
            </CardHeader>
            <CardBody className="text-sm text-secondary leading-relaxed flex flex-col gap-2">
              <p>
                Users with <code>project:write</code> access gain access to the Smart Sync panel in Project Settings.
                They can choose which documentation sections to synchronize.
              </p>
              <p>
                Users without <code>project:write</code> (Viewers and Editors) cannot modify sync settings, ensuring
                access control over automated repository modifications.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Knowledge Areas Matrix */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-brand" />
              <CardTitle>Knowledge Areas Impact Matrix</CardTitle>
            </div>
            <span className="text-xs text-tertiary">10 areas evaluated</span>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-wrapper border-0 rounded-none">
              <table>
                <thead>
                  <tr>
                    <th>Knowledge Area</th>
                    <th>Status</th>
                    <th>Confidence</th>
                    <th>Reasoning & Traceability</th>
                  </tr>
                </thead>
                <tbody>
                  {affectedAreas.map((area) => (
                    <tr key={area.name}>
                      <td className="font-semibold text-primary">{area.name}</td>
                      <td>
                        <Badge
                          variant={
                            area.status === 'definitely'
                              ? 'error'
                              : area.status === 'possibly'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {area.status}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant="default">{area.confidence}</Badge>
                      </td>
                      <td className="text-xs text-secondary leading-relaxed">{area.reasoning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Risks and Recommended Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-warning" />
                <CardTitle>Potential Risks (What Could Become Incorrect)</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="flex flex-col gap-3 text-xs text-secondary">
                {risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 flex-shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileCheck size={16} className="text-brand" />
                <CardTitle>Recommended Documentation Actions</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <ul className="flex flex-col gap-3 text-xs text-secondary">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
