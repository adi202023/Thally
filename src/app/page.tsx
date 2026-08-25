'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  FileSearch,
  GitBranch,
  GitCommit,
  Network,
  Play,
  UserCheck,
} from 'lucide-react';
import { Header, Pipeline } from '@/components/WorkspaceView';

function Stat({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'cyan',
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ size?: number }>;
  tone?: string;
}) {
  return (
    <div
      className={`stat-card ${tone}`}
      data-testid={`stat-${label
        .toLowerCase()
        .replaceAll(' ', '-')}`}
    >
      <div className="stat-icon">
        <Icon size={17} />
      </div>

      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export default function DashboardPage() {
  const [online, setOnline] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetch('/api/')
      .then((res) => {
        if (res.ok) setOnline(true);
      })
      .catch(() => setOnline(false));
  }, []);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
    }, 1500);
  };

  const areas = [
    'Smart Sync',
    'Project Settings',
    'Getting Started',
    'Permissions',
    'API Reference',
    'Changelog',
    'FAQ',
  ];

  return (
    <>
      <Header
        eyebrow="overview / live"
        title="Knowledge, synchronized."
        subtitle="A traceable command center for keeping product reality and product knowledge in lockstep."
        action={{
          label: running
            ? 'Analyzing...'
            : 'Run knowledge analysis',
          onClick: run,
          icon: <Play size={15} />,
        }}
        actionTestId="run-analysis-button"
      />

      <div className="page-content">
        <div className="hero-banner">
          <div className="hero-copy">
            <span className="live-label">
              <span className="pulse-dot" />
              LIVE REPOSITORY SIGNAL
            </span>

            <h2>
              Smart Sync <span>→</span>
              <br />
              <b>documentation aligned.</b>
            </h2>

            <p>
              One product change detected. 14 evidence sources traced.
              Human review is the final gate.
            </p>

            <div className="hero-actions">
              <Link
                className="solid-button"
                href="/review"
                data-testid="review-proposal-button"
              >
                Review proposal
                <ArrowUpRight size={15} />
              </Link>

              <Link
                className="ghost-button"
                href="/evidence"
                data-testid="view-evidence-button"
              >
                Explore evidence
              </Link>
            </div>
          </div>

          <div
            className="hero-visual"
            data-testid="hero-visual"
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="core">
              <Network size={35} />
              <span>
                SYNC
                <br />
                CORE
              </span>
            </div>

            <div className="floating-tag tag-a">
              <GitCommit size={13} />
              a3f8c2d
            </div>

            <div className="floating-tag tag-b">
              <CheckCircle2 size={13} />
              100% traced
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <Stat
            label="Product changes"
            value="01"
            detail="active branch · main"
            icon={GitBranch}
          />

          <Stat
            label="Knowledge areas"
            value="10"
            detail="06 definitely affected"
            icon={Network}
            tone="pink"
          />

          <Stat
            label="Source evidence"
            value="14"
            detail="traceable items"
            icon={FileSearch}
            tone="violet"
          />

          <Stat
            label="Open reviews"
            value="01"
            detail="human-in-the-loop"
            icon={UserCheck}
            tone="orange"
          />

          <Stat
            label="Agent chunks"
            value="47"
            detail="synchronized · v1.1.0"
            icon={Bot}
            tone="green"
          />

          <Stat
            label="Backend signal"
            value={online ? 'OK' : '—'}
            detail={
              online
                ? 'FastAPI connected'
                : 'connecting...'
            }
            icon={Activity}
            tone="blue"
          />
        </div>

        <section className="panel pipeline-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                WORKFLOW ORCHESTRATION
              </span>
              <h3>From commit to context</h3>
            </div>

            <span className="status-badge">
              <span className="pulse-dot" />
              10 stages active
            </span>
          </div>

          <Pipeline />
        </section>

        <div className="dashboard-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">IMPACT RADAR</span>
                <h3>Knowledge areas in motion</h3>
              </div>

              <Link
                href="/impact"
                className="text-link"
                data-testid="impact-report-link"
              >
                Full report
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="bar-list">
              {areas.map((area, index) => (
                <div
                  className="bar-row"
                  key={area}
                  data-testid={`knowledge-area-${index}`}
                >
                  <div>
                    <b>{area}</b>
                    <small>
                      {index < 6
                        ? 'definitely affected'
                        : 'possibly affected'}
                    </small>
                  </div>

                  <div className="bar-track">
                    <i
                      style={{
                        width: `${95 - index * 8}%`,
                      }}
                    />
                  </div>

                  <span>
                    {index < 6 ? 'HIGH' : 'MED'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">AUDIT STREAM</span>
                <h3>Recent activity</h3>
              </div>

              <Link
                href="/audit"
                className="text-link"
                data-testid="audit-trail-link"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {[
              'Agent knowledge synchronized',
              'Documentation v1.1.0 published',
              'Proposal edited by Alex Chen',
              'Knowledge analysis completed',
            ].map((item, index) => (
              <div
                className="activity-row"
                key={item}
              >
                <span className={`activity-icon tone-${index}`}>
                  <Check size={13} />
                </span>

                <div>
                  <b>{item}</b>
                  <small>
                    Today, {15 - index}:3{index} UTC ·{' '}
                    <span>
                      {index === 0
                        ? '47 chunks indexed'
                        : 'Smart Sync release'}
                    </span>
                  </small>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
