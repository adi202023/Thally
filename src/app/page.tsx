'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Code2,
  ScanSearch,
  Share2,
  Bot,
  ArrowRight,
  PencilLine,
  CheckCircle2,
  Send,
  ArrowUpRight,
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ApprovalState = 'idle' | 'reviewing' | 'approved' | 'published';

interface ActivityItem {
  id: string;
  dot: string;
  title: string;
  detail: string;
  time: string;
}

interface Stage {
  icon: React.ElementType;
  title: string;
  description: string;
  active?: boolean;
}

/* ─── Static Data ────────────────────────────────────────────────────────── */
const STAGES: Stage[] = [
  {
    icon: Code2,
    title: 'Code Ingestion',
    description: 'Monitoring GitHub & GitLab repositories for real-time changes.',
  },
  {
    icon: ScanSearch,
    title: 'Change Analysis',
    description: '14 evidence sources detected in last hour. Diffing metadata.',
  },
  {
    icon: Share2,
    title: 'Knowledge Graph',
    description: 'Smart Sync active. Structuring entities and relationships.',
  },
  {
    icon: Bot,
    title: 'Agent Action',
    description: 'Drafting documentation updates for immediate engineering review.',
    active: true,
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    dot: 'bg-foreground dark:bg-white',
    title: 'Updated Auth Flow Docs',
    detail: 'Based on PR #442 · metadata link',
    time: '10M AGO',
  },
  {
    id: '2',
    dot: 'bg-muted-foreground',
    title: 'Synthesis: API V2 Specs',
    detail: 'Merging 4 evidence sources',
    time: '42M AGO',
  },
  {
    id: '3',
    dot: 'bg-red-500',
    title: 'Conflict: Schema Definition',
    detail: 'Manual resolution required',
    time: '1H AGO',
  },
  {
    id: '4',
    dot: 'bg-emerald-500',
    title: 'Knowledge Graph Refined',
    detail: 'Dependency chain updated',
    time: '2H AGO',
  },
  {
    id: '5',
    dot: 'bg-muted-foreground',
    title: 'Draft: Deployment Guide',
    detail: 'LLM-assisted draft created',
    time: '5H AGO',
  },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();

  const [evidenceCount, setEvidenceCount] = useState(14);
  const [evidenceDelta, setEvidenceDelta] = useState(2);
  const [knowledgeAreas, setKnowledgeAreas] = useState(128);
  const [syncHealth, setSyncHealth] = useState(100);
  const [indexingCoverage, setIndexingCoverage] = useState(97);
  const [approvalState, setApprovalState] = useState<ApprovalState>('idle');
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [telemetryTick, setTelemetryTick] = useState(62);

  // Live telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((t) => t + 1);
      setSyncHealth((v) => Math.min(100, Math.max(92, v + (Math.random() > 0.6 ? 1 : -0.5))));
      setIndexingCoverage((v) => Math.min(100, Math.max(90, v + (Math.random() > 0.6 ? 0.8 : -0.4))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleReview = () => {
    setApprovalState('reviewing');
    router.push('/review');
  };

  const handleApprove = () => {
    setApprovalState('approved');
    setEvidenceCount((n) => n + 1);
    setEvidenceDelta((d) => d + 1);
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      dot: 'bg-emerald-500',
      title: 'Manual Approval Granted',
      detail: 'Triggered by engineering review',
      time: 'JUST NOW',
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
  };

  const handlePublish = () => {
    setApprovalState('published');
    router.push('/preview');
  };

  return (
    <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Status pill */}
        <span className="inline-flex items-center gap-2 rounded-md bg-foreground/10 px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          SYSTEM STATUS: OPTIMAL
        </span>

        {/* Hero */}
        <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Intelligent Documentation Engine
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Visualizing the flow from raw code changes to synthesized knowledge. Thally agents are actively
          monitoring your ecosystem.
        </p>

        {/* Synthesis Pipeline */}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Synthesis Pipeline</h2>
            <Link
              href="/changes"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground no-underline"
            >
              Pipeline Settings
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((stage) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.title}
                  className={
                    stage.active
                      ? 'rounded-xl border border-border bg-card p-6 text-center shadow-sm'
                      : 'rounded-xl border border-border bg-card p-6 text-center shadow-sm'
                  }
                >
                  <div
                    className={
                      stage.active
                        ? 'mx-auto grid size-14 place-items-center rounded-xl bg-foreground text-background'
                        : 'mx-auto grid size-14 place-items-center rounded-xl bg-muted text-muted-foreground'
                    }
                  >
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{stage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom split: Smart Sync + Recent Activity */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Smart Sync Status */}
          <div className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Smart Sync Status</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Real-time synthesis performance metrics</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleReview}
                    className="inline-flex items-center gap-1.5 rounded-md bg-foreground/10 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/15 cursor-pointer border-none"
                  >
                    <PencilLine className="size-4" />
                    Review
                  </button>
                  <button
                    onClick={handleApprove}
                    className={`inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted cursor-pointer ${
                      approvalState === 'approved' ? 'text-emerald-500' : 'text-foreground'
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                    {approvalState === 'approved' ? 'Approved' : 'Approve'}
                  </button>
                  <button
                    onClick={handlePublish}
                    className={`inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted cursor-pointer ${
                      approvalState === 'published' ? 'text-emerald-500' : 'text-foreground'
                    }`}
                  >
                    <Send className="size-4" />
                    {approvalState === 'published' ? 'Published' : 'Publish'}
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Evidence Sources
                    </span>
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground">
                      High Frequency
                    </span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tight text-foreground">{evidenceCount}</span>
                    <span className="mb-1 inline-flex items-center gap-0.5 text-sm font-medium text-foreground">
                      <ArrowUpRight className="size-4" />
                      +{evidenceDelta} new
                    </span>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sync Health</span>
                      <span className="font-medium text-foreground">{Math.round(syncHealth)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-all duration-500"
                        style={{ width: `${Math.round(syncHealth)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Knowledge Areas
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Stable
                    </span>
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tight text-foreground">{knowledgeAreas}</span>
                    <span className="mb-1 inline-flex items-center gap-0.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <ArrowUpRight className="size-4" />
                      +12 this week
                    </span>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Indexing Coverage</span>
                      <span className="font-medium text-foreground">{Math.round(indexingCoverage)}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.round(indexingCoverage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between border-t border-border pt-6 mt-8">
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Live Telemetry Stream Active
                </span>
                <span className="font-mono text-xs text-muted-foreground">tick #{telemetryTick}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground">Recent Agent Activity</h2>

              <ul className="mt-6 flex flex-1 flex-col gap-4 divide-y divide-border/60">
                {activities.map((a, idx) => (
                  <li key={a.id} className={`flex items-start gap-3 ${idx > 0 ? 'pt-4' : ''}`}>
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${a.dot}`} aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{a.title}</p>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {a.time}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground truncate">{a.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                href="/audit"
                className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted no-underline"
              >
                View Activity Log
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

