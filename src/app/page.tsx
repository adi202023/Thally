'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type ApprovalState = 'idle' | 'reviewing' | 'approved' | 'published';

interface ActivityItem {
  id: string;
  color: string;
  title: string;
  subtitle: string;
  time: string;
}

interface PipelineNode {
  icon: string;
  label: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  fill: boolean;
  active?: boolean;
}

/* ─── Static Data ────────────────────────────────────────────────────────── */
const PIPELINE_NODES: PipelineNode[] = [
  {
    icon: 'code',
    label: 'Code Ingestion',
    desc: 'Monitoring GitHub & GitLab repositories for real-time changes.',
    iconBg: 'bg-surface-container dark:bg-black/30',
    iconColor: 'text-outline dark:text-outline-variant',
    fill: false,
  },
  {
    icon: 'manage_search',
    label: 'Change Analysis',
    desc: '14 evidence sources detected in last hour. Diffing metadata.',
    iconBg: 'bg-primary/10 dark:bg-primary/20',
    iconColor: 'text-primary dark:text-primary-fixed-dim',
    fill: true,
  },
  {
    icon: 'hub',
    label: 'Knowledge Graph',
    desc: 'Smart Sync active. Structuring entities and relationships.',
    iconBg: 'bg-accent-indigo/10 dark:bg-accent-indigo/20',
    iconColor: 'text-accent-indigo dark:text-inverse-primary',
    fill: true,
  },
  {
    icon: 'smart_toy',
    label: 'Agent Action',
    desc: 'Drafting documentation updates for immediate engineering review.',
    iconBg: 'bg-gradient-to-br from-primary to-accent-indigo',
    iconColor: 'text-white',
    fill: true,
    active: true,
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    color: 'bg-primary',
    title: 'Updated Auth Flow Docs',
    subtitle: 'Based on PR #442 · metadata link',
    time: '10M AGO',
  },
  {
    id: '2',
    color: 'bg-accent-indigo',
    title: 'Synthesis: API V2 Specs',
    subtitle: 'Merging 4 evidence sources',
    time: '42M AGO',
  },
  {
    id: '3',
    color: 'bg-red-500',
    title: 'Conflict: Schema Definition',
    subtitle: 'Manual resolution required',
    time: '1H AGO',
  },
  {
    id: '4',
    color: 'bg-green-500',
    title: 'Knowledge Graph Refined',
    subtitle: 'Dependency chain updated',
    time: '2H AGO',
  },
  {
    id: '5',
    color: 'bg-outline',
    title: 'Draft: Deployment Guide',
    subtitle: 'LLM-assisted draft created',
    time: '5H AGO',
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function ProgressBar({ value, color = 'bg-primary' }: { value: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-surface-container-highest dark:bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function MetricBadge({ label, variant }: { label: string; variant: 'freq' | 'stable' | 'warn' }) {
  const styles = {
    freq: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim border-primary/20 dark:border-primary/30',
    stable: 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20',
    warn: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();

  const [evidenceCount, setEvidenceCount] = useState(14);
  const [evidenceDelta, setEvidenceDelta] = useState(2);
  const [knowledgeAreas, setKnowledgeAreas] = useState(128);
  const [syncHealth, setSyncHealth] = useState(98);
  const [indexingCoverage, setIndexingCoverage] = useState(84);
  const [approvalState, setApprovalState] = useState<ApprovalState>('idle');
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [telemetryTick, setTelemetryTick] = useState(0);

  // Simulate live telemetry updates every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((t) => t + 1);
      // Small realistic fluctuations
      setSyncHealth((v) => Math.min(100, Math.max(90, v + (Math.random() > 0.5 ? 0.5 : -0.3))));
      setIndexingCoverage((v) =>
        Math.min(99, Math.max(78, v + (Math.random() > 0.5 ? 0.8 : -0.4)))
      );
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
    // Add a new activity item
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      color: 'bg-green-500',
      title: 'Manual Approval Granted',
      subtitle: 'Triggered by dashboard action',
      time: 'JUST NOW',
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
  };

  const handlePublish = () => {
    setApprovalState('published');
    router.push('/preview');
  };

  return (
    <>
      <main className="min-h-screen px-4 md:px-10 py-8 pb-32">

        {/* ── Dashboard Header ─────────────────────────────────────────── */}
        <header className="mb-10 fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-primary-fixed-dim/20 text-primary dark:text-primary-fixed-dim rounded-full font-label-caps text-label-caps border border-primary/20 dark:border-primary-fixed-dim/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              System Status: Optimal
            </span>
          </div>
          <h1 className="font-display-hero text-headline-lg-mobile md:text-display-hero text-text-primary dark:text-inverse-on-surface mb-3">
            Intelligent Documentation Engine
          </h1>
          <p className="font-body-md text-body-md text-text-secondary dark:text-outline-variant max-w-2xl">
            Visualizing the flow from raw code changes to synthesized knowledge.
            Thally agents are actively monitoring your ecosystem.
          </p>
        </header>

        {/* ── Synthesis Pipeline ───────────────────────────────────────── */}
        <section className="mb-8 fade-in-up stagger-1">
          {/* Section header row */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold tracking-tight text-text-primary dark:text-inverse-on-surface">
              Synthesis Pipeline
            </h2>
            <Link
              href="/changes"
              className="flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary-fixed-dim hover:underline no-underline transition-opacity hover:opacity-80"
            >
              Pipeline Settings
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          {/* Pipeline node cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PIPELINE_NODES.map((node) => (
              <div
                key={node.label}
                className={`glass-card rounded-xl p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-200 cursor-default${
                  node.active
                    ? ' border-primary/40 dark:border-primary/60 shadow-[0_0_20px_rgba(107,56,212,0.12)] dark:shadow-[0_0_20px_rgba(107,56,212,0.3)]'
                    : ''
                }`}
              >
                {/* Icon container */}
                <div
                  className={`w-14 h-14 rounded-xl ${node.iconBg} flex items-center justify-center mb-4 border border-border-subtle dark:border-white/10 shadow-sm`}
                >
                  <span
                    className={`material-symbols-outlined text-[26px] ${node.iconColor}`}
                    style={{ fontVariationSettings: node.fill ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {node.icon}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-text-primary dark:text-inverse-on-surface mb-1.5 leading-tight">
                  {node.label}
                </h3>
                <p className="text-xs text-text-secondary dark:text-outline-variant leading-relaxed">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Smart Sync Status + Recent Activity ──────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch fade-in-up stagger-2">

          {/* ── Smart Sync Status Card ── */}
          <div className="lg:col-span-8 rounded-xl border-2 border-primary/30 dark:border-primary/50 bg-white/80 dark:bg-[#1e2028]/80 backdrop-blur-sm shadow-[0_0_30px_rgba(107,56,212,0.08)] dark:shadow-[0_0_30px_rgba(107,56,212,0.2)] overflow-hidden flex flex-col justify-between">

            {/* Top area (Header + Metrics) */}
            <div>
              {/* Card header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-text-primary dark:text-inverse-on-surface leading-tight">
                    Smart Sync Status
                  </h3>
                  <p className="text-xs text-text-secondary dark:text-outline-variant mt-0.5">
                    Real-time synthesis performance metrics
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    id="dashboard-review-btn"
                    onClick={handleReview}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      approvalState === 'reviewing'
                        ? 'bg-primary text-white shadow-[0_0_12px_rgba(107,56,212,0.4)]'
                        : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim hover:bg-primary/20 dark:hover:bg-primary/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                      rate_review
                    </span>
                    Review
                  </button>

                  <button
                    id="dashboard-approve-btn"
                    onClick={handleApprove}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                      approvalState === 'approved'
                        ? 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30'
                        : 'border-border-subtle dark:border-white/10 text-text-secondary dark:text-outline-variant hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-primary-fixed-dim'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                      check_circle
                    </span>
                    {approvalState === 'approved' ? 'Approved' : 'Approve'}
                  </button>

                  <button
                    id="dashboard-publish-btn"
                    onClick={handlePublish}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                      approvalState === 'published'
                        ? 'bg-primary text-white border-primary shadow-[0_0_12px_rgba(107,56,212,0.4)]'
                        : 'border-border-subtle dark:border-white/10 text-text-secondary dark:text-outline-variant hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-primary-fixed-dim'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                      send
                    </span>
                    {approvalState === 'published' ? 'Published' : 'Publish'}
                  </button>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 pt-4 pb-6">

                {/* Evidence Sources */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-text-secondary dark:text-outline-variant">
                      Evidence Sources
                    </span>
                    <MetricBadge label="High Frequency" variant="freq" />
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-text-primary dark:text-inverse-on-surface leading-none tracking-tight">
                      {evidenceCount}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary-fixed-dim mb-1">
                      <span className="material-symbols-outlined text-[14px]">north_east</span>
                      +{evidenceDelta} new
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary dark:text-outline-variant">Sync Health</span>
                      <span className="font-mono font-bold text-primary dark:text-primary-fixed-dim">
                        {Math.round(syncHealth)}%
                      </span>
                    </div>
                    <ProgressBar value={syncHealth} color="bg-gradient-to-r from-primary to-accent-indigo" />
                  </div>
                </div>

                {/* Knowledge Areas */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-text-secondary dark:text-outline-variant">
                      Knowledge Areas
                    </span>
                    <MetricBadge label="Stable" variant="stable" />
                  </div>

                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-black text-text-primary dark:text-inverse-on-surface leading-none tracking-tight">
                      {knowledgeAreas}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                      <span className="material-symbols-outlined text-[14px]">north_east</span>
                      +12 this week
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary dark:text-outline-variant">Indexing Coverage</span>
                      <span className="font-mono font-bold text-green-600 dark:text-green-400">
                        {Math.round(indexingCoverage)}%
                      </span>
                    </div>
                    <ProgressBar value={indexingCoverage} color="bg-gradient-to-r from-green-500 to-emerald-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Live telemetry footer */}
            <div className="px-6 py-3 bg-primary/5 dark:bg-primary/10 border-t border-primary/10 dark:border-primary/20 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-text-secondary dark:text-outline-variant uppercase">
                Live Telemetry Stream Active
              </span>
              <span className="ml-auto font-mono text-[10px] text-text-secondary dark:text-outline-variant opacity-60">
                tick #{telemetryTick}
              </span>
            </div>
          </div>

          {/* ── Recent Agent Activity ── */}
          <div className="lg:col-span-4 glass-card rounded-xl flex flex-col justify-between overflow-hidden">
            <div>
              <div className="p-5 pb-3 border-b border-border-subtle dark:border-white/10">
                <h3 className="text-base font-bold text-text-primary dark:text-inverse-on-surface">
                  Recent Agent Activity
                </h3>
              </div>

              {/* Activity list */}
              <ul className="divide-y divide-border-subtle dark:divide-white/5">
                {activities.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 px-5 py-2.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {/* Colored dot */}
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-text-primary dark:text-inverse-on-surface leading-tight truncate">
                          {item.title}
                        </p>
                        <span className="flex-shrink-0 text-[10px] font-mono text-text-secondary dark:text-outline-variant opacity-70 mt-0.5">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-text-secondary dark:text-outline-variant mt-0.5 leading-snug truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* View Activity Log button */}
            <div className="p-3.5 border-t border-border-subtle dark:border-white/10">
              <Link
                href="/audit"
                id="view-activity-log-btn"
                className="no-underline w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border-subtle dark:border-white/10 text-xs font-semibold text-text-primary dark:text-inverse-on-surface hover:border-primary/40 dark:hover:border-primary/50 hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-primary/5 dark:hover:bg-white/5 transition-all duration-200"
              >
                View Activity Log
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
