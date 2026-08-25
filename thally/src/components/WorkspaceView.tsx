'use client';

import React from 'react';
import Link from 'next/link';
import {
  CircleDot,
  ArrowUpRight,
  GitCommit,
  Network,
  FileSearch,
  UserCheck,
  Cloud,
  History,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  Zap,
  Check,
} from 'lucide-react';

export function Header({
  eyebrow,
  title,
  subtitle,
  action,
  actionTestId,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  actionTestId?: string;
}) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">
          <CircleDot size={11} />
          THALLY CONTROL PLANE
          <span>/</span>
          {eyebrow}
        </div>

        <h1 data-testid="page-title">{title}</h1>
        <p>{subtitle}</p>
      </div>

      {action && (
        <button
          className="neon-button"
          data-testid={actionTestId}
          onClick={action.onClick}
        >
          {action.icon || <Zap size={15} />}
          {action.label}
          <ArrowUpRight size={15} />
        </button>
      )}
    </header>
  );
}

export function Pipeline({ current = 8 }: { current?: number }) {
  const steps = [
    'Change',
    'Impact',
    'Evidence',
    'Task',
    'Proposal',
    'Review',
    'Preview',
    'Merge',
    'Published',
    'Agent',
  ];

  return (
    <div className="pipeline" data-testid="sync-pipeline">
      {steps.map((step, index) => (
        <div className="pipeline-step" key={step}>
          <div
            className={`pipeline-node ${
              index < current
                ? 'done'
                : index === current
                ? 'current'
                : ''
            }`}
          >
            {index < current ? (
              <Check size={12} />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>

          <small>{step}</small>

          {index < steps.length - 1 && (
            <i className={index < current ? 'done' : ''} />
          )}
        </div>
      ))}
    </div>
  );
}

export function WorkspaceView({ type }: { type: string }) {
  const configs: Record<string, [string, string, string, React.ComponentType<{ size?: number }>]> = {
    changes: [
      'changes / active',
      'Product changes',
      'The source events powering your knowledge graph.',
      GitCommit,
    ],
    impact: [
      'analysis / graph',
      'Impact analysis',
      'See exactly how a code change ripples through product knowledge.',
      Network,
    ],
    evidence: [
      'evidence / traceable',
      'Source evidence explorer',
      'Every recommendation is anchored to code, tests, schemas, or UI.',
      FileSearch,
    ],
    review: [
      'review / human gate',
      'Proposal review',
      'Correct, approve, or reject the documentation update before publishing.',
      UserCheck,
    ],
    preview: [
      'preview / gated',
      'Deployment preview',
      'Seven checks stand between a proposal and published knowledge.',
      Cloud,
    ],
    audit: [
      'audit / immutable',
      'Audit trail',
      'A complete record of every decision made by the knowledge engine.',
      History,
    ],
    verification: [
      'verification / complete',
      'Documentation change verified',
      'End-to-end provenance for the Smart Sync release.',
      ShieldCheck,
    ],
    docs: [
      'docs / published',
      'Documentation portal',
      'Product knowledge, verified against reality and ready for humans.',
      BookOpen,
    ],
  };

  const [eyebrow, title, subtitle, Icon] = configs[type] || configs.changes;

  const rows =
    type === 'evidence'
      ? [
          'feat(sync): introduce Smart Sync',
          'SmartSyncSettings.ts',
          'POST /api/v1/sync Endpoint',
          'requireScope(project:write)',
          'SmartSyncPanel.tsx',
          'smartSync.test.ts',
          'CHANGELOG.md',
          'Rate Limit Configuration',
        ]
      : type === 'verification'
      ? [
          'Product Change',
          'Impact Analysis',
          'Source Evidence',
          'Documentation Task',
          'Proposed Update',
          'Human Review',
          'Deployment Preview',
          'Merge Gate',
          'Published Docs',
          'Agent Knowledge',
        ]
      : [
          'Smart Sync — Connected Documentation Sync',
          'Project Settings configuration updated',
          '6 knowledge areas affected',
          '14 evidence items traced',
          'Human maintainer review required',
        ];

  return (
    <>
      <Header
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={{
          label:
            type === 'review'
              ? 'Approve & generate preview'
              : 'Open live workspace',
          icon: <Zap size={15} />,
          onClick: () => {},
        }}
        actionTestId={`${type}-primary-action`}
      />

      <div className="page-content">
        <section className="panel feature-panel">
          <div className="feature-icon">
            <Icon size={24} />
          </div>

          <div>
            <span className="eyebrow">SMART SYNC · A3F8C2D</span>

            <h2>
              {type === 'verification'
                ? '10 / 10 stages verified'
                : type === 'review'
                ? 'Human judgment is the feature.'
                : 'Connected documentation sync'}
            </h2>

            <p>
              {type === 'review'
                ? 'The automated proposal was corrected from ‘all documentation’ to the sources your team selects.'
                : 'Thally watches the repository, traces meaningful change, and keeps the right knowledge moving.'}
            </p>
          </div>
        </section>

        {type === 'verification' ? (
          <Pipeline current={10} />
        ) : (
          <div className="workspace-grid">
            {rows.map((row, index) => (
              <div
                className="workspace-row"
                key={row}
                data-testid={`${type}-row-${index}`}
              >
                <span className="row-index">0{index + 1}</span>

                <div>
                  <b>{row}</b>
                  <small>
                    {index % 2
                      ? 'Verified source · line 14–40'
                      : 'Ready for maintainer review'}
                  </small>
                </div>

                <span
                  className={`row-state ${
                    index < 3 ? 'green' : 'pink'
                  }`}
                >
                  {index < 3 ? 'VERIFIED' : 'IN REVIEW'}
                </span>

                <ChevronRight size={16} />
              </div>
            ))}
          </div>
        )}

        <div className="terminal panel-inner">
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
          </div>

          <p>
            <span className="green-text">thally@control-plane</span>
            :~$ trace --change <b>a3f8c2d</b>
            <br />
            <span className="muted-text">→ mapping repository signals...</span>{' '}
            <span className="green-text">done</span>
            <br />
            <span className="muted-text">
              → 14 evidence sources connected · 10 knowledge areas classified
            </span>
            <br />
            <span className="pink-text">→ awaiting human gate</span>
            <span className="cursor">▋</span>
          </p>
        </div>
      </div>
    </>
  );
}
