'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/WorkspaceView';
import { Zap, Mail, MessageCircle } from 'lucide-react';
import { FaqAccordion } from '@/components/ui/FaqAccordion';

const FAQ_ITEMS = [
  {
    question: 'How do I enable Smart Sync?',
    answer: 'Go to Project Settings → Smart Sync, select your documentation sources and sync frequency, then click Enable Smart Sync. Requires the project:write scope.',
  },
  {
    question: 'What repositories can Thally connect to?',
    answer: 'Thally supports GitHub, GitLab, and Bitbucket repositories. Connect via Project Settings → Repository using a personal access token with the repo scope.',
  },
  {
    question: 'How is documentation reviewed before publishing?',
    answer: 'Every AI-generated proposal goes through a human review gate. A maintainer must explicitly approve or reject the proposal before it can be deployed to the live documentation portal.',
  },
  {
    question: 'Can I customize sync frequency?',
    answer: 'Yes. You can set the frequency to Manual, Hourly, Daily, or Weekly in Project Settings → Smart Sync. The default is Manual.',
  },
];

const TICKETS = [
  { id: '1042', title: 'Smart Sync not triggering', status: 'IN PROGRESS', statusClass: 'pink' },
  { id: '1039', title: 'API schema mismatch', status: 'RESOLVED', statusClass: 'green' },
];

const TOPIC_TAGS = [
  'All',
  'Smart Sync',
  'Repositories',
  'Review Gate',
  'Sync Frequency',
  'Permissions',
];

export default function SupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  const filteredFaqs = FAQ_ITEMS.filter((f) => {
    const matchesSearch = !search.trim() ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      String(f.answer).toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === 'All' ||
      f.question.toLowerCase().includes(selectedTopic.toLowerCase()) ||
      String(f.answer).toLowerCase().includes(selectedTopic.toLowerCase());
    return matchesSearch && matchesTopic;
  });

  const filteredTickets = TICKETS.filter((t) =>
    !search.trim() ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.id.includes(search)
  );

  return (
    <>
      <Header
        eyebrow="support / help"
        title="Support"
        subtitle="Get help from the team or search our knowledge base."
        action={{ label: 'Browse Docs', icon: <Zap size={15} />, onClick: () => router.push('/docs') }}
        actionTestId="support-docs-action"
      />

      <div className="page-content">
        {/* Search bar */}
        <div className="panel p-3">
          <div className="relative flex items-center">
            <span
              className="material-symbols-outlined absolute left-3 text-muted-foreground pointer-events-none select-none text-[20px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search help articles, questions, or tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="support-search"
              className="w-full pl-10 pr-20 py-2 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground bg-muted rounded border border-border cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-mono text-muted-foreground mr-1">Topics:</span>
          {TOPIC_TAGS.map((tag) => {
            const isSelected = selectedTopic === tag && !search;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTopic(tag);
                  if (tag !== 'All') setSearch(tag);
                  else setSearch('');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  isSelected || search.toLowerCase() === tag.toLowerCase()
                    ? 'bg-foreground text-background border-foreground font-semibold'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground hover:bg-muted/80'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel feature-panel">
            <div className="feature-icon">
              <Mail size={22} />
            </div>
            <div>
              <span className="eyebrow">EMAIL</span>
              <h2 className="text-base font-bold text-foreground my-1">Email Support</h2>
              <p className="text-sm text-muted-foreground">support@thally.io — response within 24h</p>
            </div>
          </div>

          <div className="panel feature-panel">
            <div className="feature-icon">
              <MessageCircle size={22} />
            </div>
            <div>
              <span className="eyebrow">LIVE CHAT</span>
              <h2 className="text-base font-bold text-foreground my-1">Live Chat</h2>
              <p className="text-sm text-muted-foreground">Chat with our team — avg response 5 min</p>
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <FaqAccordion items={filteredFaqs} title="Frequently Asked Questions" />

        {/* Open tickets */}
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground mb-3">
            Open Tickets
          </h3>
          <div className="panel workspace-grid">
            {filteredTickets.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No tickets matching &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredTickets.map((t, i) => (
                <div className="workspace-row" key={t.id} data-testid={`ticket-row-${i}`}>
                  <span className="row-index">#{t.id}</span>
                  <div>
                    <b className="text-foreground">{t.title}</b>
                    <small className="text-muted-foreground">Ticket #{t.id}</small>
                  </div>
                  <span className={`row-state ${t.statusClass}`}>{t.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center pb-2">
          <Link
            href="/docs"
            className="eyebrow no-underline hover:opacity-70 transition-opacity inline-flex items-center gap-1.5"
          >
            Browse the full documentation portal
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </>
  );
}
