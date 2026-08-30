'use client';

import React from 'react';
import { Header } from '@/components/WorkspaceView';
import { Server } from 'lucide-react';

const INFRA_ROWS = [
  {
    label: 'Sync Engine — Primary Node',
    meta: 'us-east-1 · 4 vCPU / 8GB RAM',
    status: 'HEALTHY',
    statusClass: 'green',
  },
  {
    label: 'Indexing Worker — Node 2',
    meta: 'us-east-1 · 2 vCPU / 4GB RAM',
    status: 'HEALTHY',
    statusClass: 'green',
  },
  {
    label: 'Vector Store',
    meta: 'Pinecone · 128 knowledge areas indexed',
    status: 'HEALTHY',
    statusClass: 'green',
  },
  {
    label: 'Event Queue',
    meta: 'Redis · 14 evidence sources streaming',
    status: 'HEALTHY',
    statusClass: 'green',
  },
  {
    label: 'Backup Snapshot',
    meta: 'Last snapshot 2h ago',
    status: 'SCHEDULED',
    statusClass: 'pink',
  },
];

const STATS = [
  { label: 'Uptime', value: '99.98%' },
  { label: 'Active Nodes', value: '6' },
  { label: 'Avg Response', value: '142ms' },
];

export default function InfrastructurePage() {
  return (
    <>
      <Header
        eyebrow="infrastructure / compute"
        title="Infrastructure"
        subtitle="The compute and storage powering your knowledge graph."
        actionTestId="infra-primary-action"
      />

      <div className="page-content">
        {/* Overview card */}
        <section className="panel feature-panel">
          <div className="feature-icon">
            <Server size={24} />
          </div>
          <div>
            <span className="eyebrow">COMPUTE · US-EAST-1</span>
            <h2 className="text-xl font-bold text-text-primary dark:text-inverse-on-surface">Primary sync cluster</h2>
            <p className="text-sm text-text-secondary dark:text-outline-variant">
              Handles real-time ingestion, indexing, and knowledge graph updates across all
              connected repositories.
            </p>
          </div>
        </section>

        {/* Stat row */}
        <div className="panel p-5">
          <div className="flex gap-10 flex-wrap">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-text-secondary dark:text-outline-variant mb-1">
                  {s.label}
                </div>
                <div className="text-2xl font-black text-primary dark:text-[#d0bcff] tracking-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource list */}
        <div className="panel workspace-grid">
          {INFRA_ROWS.map((row, index) => (
            <div className="workspace-row" key={row.label} data-testid={`infra-row-${index}`}>
              <span className="row-index">0{index + 1}</span>
              <div>
                <b className="text-text-primary dark:text-inverse-on-surface">{row.label}</b>
                <small className="text-text-secondary dark:text-outline-variant">{row.meta}</small>
              </div>
              <span className={`row-state ${row.statusClass}`}>{row.status}</span>
            </div>
          ))}
        </div>

        {/* Terminal */}
        <div className="terminal panel-inner">
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
          </div>
          <p className="p-4 m-0 font-mono text-xs leading-relaxed">
            <span className="green-text">thally@control-plane</span>:~$ status --infra
            <br />
            <span className="muted-text">→ checking node health...</span>{' '}
            <span className="green-text">done</span>
            <br />
            <span className="muted-text">→ 6/6 nodes healthy · avg latency 142ms</span>
            <br />
            <span className="pink-text">→ next backup in 4h</span>
            <span className="cursor">▋</span>
          </p>
        </div>
      </div>
    </>
  );
}
