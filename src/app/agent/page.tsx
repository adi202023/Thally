'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Activity, ArrowUpRight, Bot, FileCode2, Send, ShieldCheck, BookOpen, Key } from 'lucide-react';
import { Header } from '@/components/WorkspaceView';

const SUGGESTIONS = [
  'What permissions are required?',
  'What sync frequencies exist?',
  'Does it sync all docs?',
];

interface Citation {
  icon: React.ReactNode;
  label: string;
  href: string;
  testId: string;
}

interface Answer {
  title: string;
  intro: string;
  steps: string[];
  citations: Citation[];
  citationCount: number;
}

const ANSWERS: Record<string, Answer> = {
  default: {
    title: 'Smart Sync — Connected Documentation Sync',
    intro: 'Smart Sync lets you automatically synchronize the documentation sources you select with your connected product repository.',
    steps: [
      'Open Project Settings',
      'Select Smart Sync and choose your documentation sources',
      'Choose a frequency: Manual, Hourly, Daily, or Weekly',
      'Click Enable Smart Sync',
    ],
    citationCount: 2,
    citations: [
      { icon: <BookOpen size={14} />, label: 'Smart Sync Guide', href: '/docs/smart-sync', testId: 'citation-smart-sync' },
      { icon: <Key size={14} />, label: 'Permissions & Scopes', href: '/docs/permissions', testId: 'citation-permissions' },
    ],
  },
  permissions: {
    title: 'Permissions & Scopes',
    intro: 'Thally uses fine-grained scopes to protect documentation integrity. Smart Sync specifically requires the project:write scope.',
    steps: [
      'Viewer role: project:read, docs:read',
      'Editor role: adds docs:write',
      'Maintainer role: all scopes except admin',
      'Admin role: full access including admin',
    ],
    citationCount: 1,
    citations: [
      { icon: <ShieldCheck size={14} />, label: 'Permissions & Scopes', href: '/docs/permissions', testId: 'citation-permissions' },
    ],
  },
  frequencies: {
    title: 'Sync Frequency Options',
    intro: 'Smart Sync supports four frequency modes, configurable per project in Project Settings.',
    steps: [
      'Manual — sync only when you trigger it explicitly',
      'Hourly — sync every hour when new commits are detected',
      'Daily — sync once per day',
      'Weekly — sync once per week',
    ],
    citationCount: 1,
    citations: [
      { icon: <BookOpen size={14} />, label: 'Smart Sync Guide', href: '/docs/smart-sync', testId: 'citation-smart-sync' },
    ],
  },
  alldocs: {
    title: 'Selective Documentation Sync',
    intro: 'No — Smart Sync only updates the documentation sources explicitly chosen by the user in Project Settings. Other areas remain unchanged.',
    steps: [
      'Open Project Settings → Smart Sync',
      'Under "Documentation Sources", check only the areas you want synced',
      'Unchecked areas are never touched by Smart Sync',
      'You can change this selection at any time',
    ],
    citationCount: 2,
    citations: [
      { icon: <BookOpen size={14} />, label: 'Smart Sync Guide', href: '/docs/smart-sync', testId: 'citation-smart-sync' },
      { icon: <FileCode2 size={14} />, label: 'Project Settings', href: '/docs/project-settings', testId: 'citation-settings' },
    ],
  },
};

function pickAnswer(query: string): Answer {
  const q = query.toLowerCase();
  if (q.includes('permission') || q.includes('scope') || q.includes('role')) return ANSWERS.permissions;
  if (q.includes('frequen') || q.includes('hourly') || q.includes('daily') || q.includes('weekly')) return ANSWERS.frequencies;
  if (q.includes('all doc') || q.includes('every doc') || q.includes('sync all')) return ANSWERS.alldocs;
  return ANSWERS.default;
}

export default function AgentPage() {
  const [query, setQuery] = useState('What permissions are required?');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(ANSWERS.permissions);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setAnswer(null);
    setTimeout(() => {
      setLoading(false);
      setAnswer(pickAnswer(q));
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(query);
  };

  return (
    <>
      <Header
        eyebrow="agent / knowledge"
        title="Ask the product."
        subtitle="Query structured context extracted from approved documentation — with provenance attached."
        action={{
          label: 'Re-sync knowledge',
          icon: <Activity size={15} />,
          onClick: () => { setAnswer(null); setQuery(''); setLoading(false); },
        }}
        actionTestId="resync-knowledge-button"
      />

      <div className="page-content">
        {/* Agent hero banner */}
        <section className="panel feature-panel">
          <div className="feature-icon">
            <Bot size={24} />
          </div>
          <div>
            <span className="eyebrow">AGENT KNOWLEDGE · v1.1.0</span>
            <h2 className="text-xl font-bold text-text-primary dark:text-inverse-on-surface">Answers with receipts.</h2>
            <p className="text-sm text-text-secondary dark:text-outline-variant">47 chunks · 8 pages · 100% citation coverage</p>
          </div>
        </section>

        {/* Input box */}
        <form onSubmit={handleFormSubmit} className="panel p-2">
          <div className="flex items-center gap-3 px-3 py-1.5">
            <Bot size={20} className="text-text-secondary dark:text-outline-variant flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your product..."
              data-testid="agent-query-input"
              className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary dark:text-inverse-on-surface placeholder:text-text-secondary dark:placeholder:text-outline-variant min-w-0"
            />
            <button
              type="submit"
              data-testid="agent-submit-button"
              disabled={loading || !query.trim()}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-accent-indigo text-white border-none rounded-full text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 shadow-sm transition-opacity"
            >
              <Send size={13} />
              Ask agent
            </button>
          </div>
        </form>

        {/* Suggestion chips */}
        <div className="flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setQuery(s); handleSubmit(s); }}
              data-testid={`suggestion-${s.slice(0, 8).replaceAll(' ', '-')}`}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#d0bcff] border border-primary/20 dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30 transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="panel p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-primary dark:text-[#d0bcff]" />
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="text-sm font-medium text-text-secondary dark:text-outline-variant">Thinking</span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-[#d0bcff] inline-block animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Answer panel */}
        {!loading && answer && (
          <section className="panel overflow-hidden" data-testid="agent-answer-panel">
            {/* Answer header */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-subtle dark:border-white/10 bg-primary/5 dark:bg-primary/10">
              <div className="w-7 h-7 rounded-full bg-primary/15 dark:bg-primary/30 border border-primary/25 dark:border-primary/40 flex items-center justify-center flex-shrink-0">
                <Bot size={15} className="text-primary dark:text-[#d0bcff]" />
              </div>
              <span className="font-bold text-sm text-text-primary dark:text-inverse-on-surface">Agent response</span>
              <span className="ml-1 text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-green-500/15 dark:bg-green-500/25 text-green-700 dark:text-green-300 border border-green-500/30 dark:border-green-500/40">
                VERIFIED · {answer.citationCount} citation{answer.citationCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Answer body */}
            <div className="p-6">
              <h3 className="text-base font-bold text-text-primary dark:text-inverse-on-surface mb-2 mt-0">
                {answer.title}
              </h3>
              <p className="text-sm text-text-secondary dark:text-[#cbc3d7] leading-relaxed mb-5">
                {answer.intro}
              </p>

              <ol className="list-decimal pl-5 space-y-2 mb-6">
                {answer.steps.map((step, i) => (
                  <li key={i} className="text-sm font-medium text-text-primary dark:text-[#f0f1f2] leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>

              {/* Citation pills */}
              <div className="flex gap-2.5 flex-wrap pt-2 border-t border-border-subtle dark:border-white/10">
                {answer.citations.map((c) => (
                  <Link
                    key={c.testId}
                    href={c.href}
                    data-testid={c.testId}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#d0bcff] border border-primary/20 dark:border-primary/40 hover:bg-primary/20 dark:hover:bg-primary/30 no-underline transition-all"
                  >
                    {c.icon}
                    {c.label}
                    <ArrowUpRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
