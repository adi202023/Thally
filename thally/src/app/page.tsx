'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitCommit,
  Sparkles,
  FileSearch,
  FileText,
  Eye,
  BookOpen,
  Bot,
  History,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';
import { ImpactGraph } from '@/components/graph/ImpactGraph';

export default function DashboardPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(true);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await fetch('/api/changes/change-smartsync-001/analyze', { method: 'POST' });
      setAnalysisDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const knowledgeAreas = [
    { slug: 'smart-sync', title: 'Smart Sync', status: 'definitely', confidence: 'High', reason: 'Entirely new user-visible feature. Dedicated guide required.' },
    { slug: 'project-settings', title: 'Project Settings', status: 'definitely', confidence: 'High', reason: 'Settings UI changed. Smart Sync configuration panel added.' },
    { slug: 'getting-started', title: 'Getting Started', status: 'definitely', confidence: 'High', reason: 'Onboarding guide needs mention of new sync capabilities.' },
    { slug: 'permissions', title: 'Permissions', status: 'definitely', confidence: 'High', reason: 'Requires project:write scope to configure.' },
    { slug: 'api-reference', title: 'API Reference', status: 'definitely', confidence: 'High', reason: 'New POST /api/v1/sync endpoint with JWT authentication.' },
    { slug: 'changelog', title: 'Changelog', status: 'definitely', confidence: 'High', reason: 'v1.1.0 release entry with feature breakdown.' },
    { slug: 'faq', title: 'FAQ', status: 'possibly', confidence: 'Medium', reason: 'Clarification on selective sync vs full repository sync.' },
    { slug: 'billing', title: 'Billing', status: 'unaffected', confidence: 'High', reason: 'Feature included in existing plans.' },
    { slug: 'teams', title: 'Teams', status: 'unaffected', confidence: 'High', reason: 'Team management scopes unchanged.' },
    { slug: 'security', title: 'Security Overview', status: 'unaffected', confidence: 'High', reason: 'Reuses existing OAuth and scope validation.' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Banner Header */}
      <header className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">THALLY</h1>
            <span className="system-status-chip">
              <span className="dot" /> LIVE SYSTEM ACTIVE
            </span>
          </div>
          <p className="page-subtitle font-medium text-secondary">
            Keep product knowledge synchronized with product reality.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/verification">
            <Button variant="secondary" size="sm" leftIcon={<CheckCircle2 size={14} className="text-success" />}>
              Verification Report
            </Button>
          </Link>
          <button
            id="run-analysis-button"
            data-testid="run-analysis-button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="neon-button"
          >
            <Sparkles size={14} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Knowledge Analysis'}</span>
          </button>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        {/* Animated Cyber Smart Sync Hero Banner */}
        <section className="hero-banner" aria-label="Smart Sync Overview">
          <div className="hero-copy">
            <div className="flex items-center gap-2 mb-2">
              <span className="system-status-chip">
                <span className="dot" /> SMART SYNC ENGINE ACTIVE
              </span>
              <span className="text-xs text-muted font-mono">v1.1.0 • AUTO-INDEXED</span>
            </div>
            <h2>
              Keep product knowledge <b>synchronized</b> with product reality.
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Thally detects code changes, extracts multi-modal AST evidence, generates human-gated proposals, and publishes verified context to live docs and AI agents.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRunAnalysis}
                className="neon-button"
              >
                <Sparkles size={14} /> Run Knowledge Analysis
              </button>
              <Link
                href="/review/proposal-smartsync-001"
                id="review-proposal-button"
                data-testid="review-proposal-button"
                className="solid-button"
              >
                <FileText size={14} /> Review Proposal
              </Link>
              <Link
                href="/changes/change-smartsync-001/evidence"
                id="view-evidence-button"
                data-testid="view-evidence-button"
                className="ghost-button"
              >
                <FileSearch size={14} /> View 14 Evidence Items
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="orbit" />
            <div className="orbit orbit-two" />
            <div className="core">
              <Sparkles size={32} />
            </div>
          </div>
        </section>

        {/* Metric Cards Grid */}
        <section className="stats-grid" aria-label="System Metrics">
          <div className="stat-card">
            <div className="stat-label">Product Changes</div>
            <strong>1</strong>
            <div className="stat-change neutral">Active repository branch</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Knowledge Areas</div>
            <strong>10</strong>
            <div className="stat-change up">6 Definitely Affected</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Source Evidence</div>
            <strong>14</strong>
            <div className="stat-change up">Traceable items</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Open Reviews</div>
            <strong>1</strong>
            <div className="stat-change up">Human-in-the-loop</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Published Docs</div>
            <strong>v1.1.0</strong>
            <div className="stat-change up">Live on /docs</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Agent Knowledge</div>
            <strong>47</strong>
            <div className="stat-change up">Chunks synchronized ✓</div>
          </div>
        </section>

        {/* Active Product Change Card */}
        <section className="change-card" aria-label="Active Product Change">
          <div className="change-card-accent" />
          <div className="change-card-body">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="change-card-icon">
                  <GitCommit size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="change-card-title">Smart Sync — Connected Documentation Sync</h2>
                    <Badge variant="success" dot>Documentation Updated</Badge>
                    <Badge variant="purple">Demo Knowledge Analysis</Badge>
                  </div>
                  <div className="change-card-commit">
                    commit <code>a3f8c2d</code> • <code>feat(sync): introduce Smart Sync for connected documentation</code>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/changes/change-smartsync-001/evidence">
                  <Button variant="secondary" size="sm" leftIcon={<FileSearch size={14} />}>
                    View 14 Evidence Items
                  </Button>
                </Link>
                <Link href="/review/proposal-smartsync-001">
                  <Button variant="primary" size="sm" leftIcon={<FileText size={14} />}>
                    Review Proposal
                  </Button>
                </Link>
              </div>
            </div>

            {/* End-to-end Workflow Pipeline */}
            <div
              id="sync-pipeline"
              data-testid="sync-pipeline"
              className="p-3 bg-surface-1 border border-subtle rounded-lg mb-4"
            >
              <div className="flex items-center justify-between px-2 pb-2 border-b border-subtle">
                <span className="text-xs font-semibold text-secondary">SYNCHRONIZATION PIPELINE</span>
                <span className="text-xs text-tertiary">10-Stage Lifecycle</span>
              </div>
              <WorkflowPipeline currentStage="agent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-secondary">
              <div className="p-3 bg-surface-1 rounded border border-subtle">
                <span className="font-semibold text-primary block mb-1">Impact Summary</span>
                Introduces automated documentation syncing based on user-selected sources and schedules.
              </div>
              <div className="p-3 bg-surface-1 rounded border border-subtle">
                <span className="font-semibold text-primary block mb-1">Human Review Result</span>
                Maintainer corrected proposal from &quot;all documentation&quot; to &quot;selected sources&quot;.
              </div>
              <div className="p-3 bg-surface-1 rounded border border-subtle">
                <span className="font-semibold text-primary block mb-1">Deployment State</span>
                Version 1.1.0 published on live docs and indexed into Agent Knowledge.
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Impact Graph */}
        <section aria-label="Impact Visualization">
          <ImpactGraph />
        </section>

        {/* Two-Column Section: Knowledge Areas & Recent Audit Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Affected Knowledge Areas */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-brand" />
                <CardTitle>Knowledge Areas Classification</CardTitle>
              </div>
              <Link
                href="/changes/change-smartsync-001/report"
                id="impact-report-link"
                data-testid="impact-report-link"
                className="text-xs text-brand font-medium hover:underline"
              >
                Full Report →
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              <div className="table-wrapper border-0 rounded-none">
                <table>
                  <thead>
                    <tr>
                      <th>Knowledge Area</th>
                      <th>Impact Status</th>
                      <th>Reasoning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {knowledgeAreas.slice(0, 7).map((ka) => (
                      <tr key={ka.slug}>
                        <td className="font-medium">
                          <Link href={`/docs/${ka.slug}`} className="text-primary hover:text-brand">
                            {ka.title}
                          </Link>
                        </td>
                        <td>
                          <Badge
                            variant={
                              ka.status === 'definitely'
                                ? 'error'
                                : ka.status === 'possibly'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {ka.status}
                          </Badge>
                        </td>
                        <td className="text-xs text-secondary">{ka.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          {/* Recent Audit Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <History size={16} className="text-brand" />
                <CardTitle>Recent Audit Trail</CardTitle>
              </div>
              <Link
                href="/audit"
                id="audit-trail-link"
                data-testid="audit-trail-link"
                className="text-xs text-brand font-medium hover:underline"
              >
                View All 13 Events →
              </Link>
            </CardHeader>
            <CardBody>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-icon purple">
                    <Bot size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Agent knowledge synchronized</div>
                    <div className="timeline-time">Today, 15:35 UTC</div>
                    <div className="timeline-detail">
                      47 chunks indexed from 8 published documentation pages.
                    </div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon success">
                    <BookOpen size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Documentation v1.1.0 published</div>
                    <div className="timeline-time">Today, 15:32 UTC</div>
                    <div className="timeline-detail">
                      Merged branch <code>docs/smart-sync-update</code> into main.
                    </div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon brand">
                    <FileText size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Proposal edited by Alex Chen</div>
                    <div className="timeline-time">Today, 15:10 UTC</div>
                    <div className="timeline-detail">
                      Corrected overstated claim: &quot;all documentation&quot; → &quot;selected sources&quot;.
                    </div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon info">
                    <Sparkles size={14} />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">Knowledge analysis completed</div>
                    <div className="timeline-time">Today, 14:26 UTC</div>
                    <div className="timeline-detail">
                      Identified 6 definitely affected areas with High confidence.
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
