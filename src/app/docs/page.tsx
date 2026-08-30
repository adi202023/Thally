'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Code2,
  History,
  Sliders,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/WorkspaceView';

export default function DocsHomePage() {
  const router = useRouter();

  const docCards = [
    {
      title: 'Smart Sync Guide',
      slug: 'smart-sync',
      desc: 'Automated documentation synchronization based on selected repository sources and frequencies.',
      icon: <Sparkles size={20} className="text-[#63f5ff]" />,
      badge: 'New in v1.1.0',
    },
    {
      title: 'Getting Started',
      slug: 'getting-started',
      desc: 'Quickstart guide to connecting your repository and configuring knowledge areas.',
      icon: <BookOpen size={20} className="text-[#ff5db1]" />,
      badge: 'Quickstart',
    },
    {
      title: 'Project Settings',
      slug: 'project-settings',
      desc: 'Configure repository webhooks, analysis sensitivity, and team assignments.',
      icon: <Sliders size={20} className="text-[#a78bfa]" />,
    },
    {
      title: 'Permissions & Scopes',
      slug: 'permissions',
      desc: 'Role-based access control and scope requirements (including project:write).',
      icon: <Shield size={20} className="text-[#ffb86b]" />,
    },
    {
      title: 'API Reference',
      slug: 'api-reference',
      desc: 'REST API documentation, JWT authentication, POST /v1/sync endpoints, and rate limits.',
      icon: <Code2 size={20} className="text-[#7dffbd]" />,
    },
    {
      title: 'Troubleshooting Guide',
      slug: 'troubleshooting',
      desc: 'Diagnostic procedures for repository integration, webhook issues, and sync rate limits.',
      icon: <Sliders size={20} className="text-[#ff5db1]" />,
    },
    {
      title: 'Changelog',
      slug: 'changelog',
      desc: 'Release notes and history, including Smart Sync v1.1.0 updates.',
      icon: <History size={20} className="text-[#63f5ff]" />,
      badge: 'v1.1.0 Live',
    },
    {
      title: 'Frequently Asked Questions',
      slug: 'faq',
      desc: 'Answers to common questions regarding automated publishing and human-in-the-loop review.',
      icon: <BookOpen size={20} className="text-[#ffb86b]" />,
    },
  ];

  return (
    <>
      <Header
        eyebrow="docs / published"
        title="Documentation portal"
        subtitle="Product knowledge, verified against reality and ready for humans."
        action={{
          label: 'Open live workspace',
          icon: <Zap size={15} />,
          onClick: () => router.push('/docs/smart-sync'),
        }}
        actionTestId="docs-primary-action"
      />

      <div className="page-content">
        <div className="max-w-5xl mx-auto">
          {/* Centered Feature Banner */}
          <section className="panel feature-panel mb-8">
            <div className="feature-icon">
              <BookOpen size={24} />
            </div>

            <div>
              <span className="eyebrow">SMART SYNC · A3F8C2D</span>
              <h2>Connected documentation sync</h2>
              <p>
                Thally watches the repository, traces meaningful change, and keeps the right knowledge moving.
                Documentation is only published after all 7 deployment checks pass.
              </p>
            </div>
          </section>

          {/* Centered 2-Column Responsive Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {docCards.map((card, index) => (
              <Link
                key={card.slug}
                href={`/docs/${card.slug}`}
                className="panel no-underline p-6 flex flex-col justify-between transition-all duration-200 hover:border-primary/40 dark:hover:border-[#63f5ff]/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(107,56,212,0.12)] dark:hover:shadow-[0_0_25px_rgba(99,245,255,0.12)]"
                data-testid={`doc-card-${index}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 dark:bg-[rgba(99,245,255,0.08)] border border-primary/20 dark:border-[rgba(99,245,255,0.2)] flex items-center justify-center">
                      {card.icon}
                    </div>
                    {card.badge && (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[rgba(255,93,177,0.12)] border border-[rgba(255,93,177,0.4)] text-[#ff5db1]">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-text-primary dark:text-[#eef6ff] mb-2">{card.title}</h3>
                  <p className="text-xs text-text-secondary dark:text-[#8192ab] leading-relaxed mb-6">{card.desc}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-primary dark:text-[#63f5ff] font-semibold mt-auto pt-3 border-t border-border-subtle dark:border-[rgba(143,185,220,0.1)]">
                  <span>Read documentation</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>

          {/* Centered Terminal Block */}
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
              <span className="pink-text">→ 6 documentation pages published · 100% verified</span>
              <span className="cursor">▋</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
