'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/WorkspaceView';
import { Zap, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How do I enable Smart Sync?',
    a: 'Go to Project Settings → Smart Sync, select your documentation sources and sync frequency, then click Enable Smart Sync. Requires the project:write scope.',
  },
  {
    q: 'What repositories can Thally connect to?',
    a: 'Thally supports GitHub, GitLab, and Bitbucket repositories. Connect via Project Settings → Repository using a personal access token with the repo scope.',
  },
  {
    q: 'How is documentation reviewed before publishing?',
    a: 'Every AI-generated proposal goes through a human review gate. A maintainer must explicitly approve or reject the proposal before it can be deployed to the live documentation portal.',
  },
  {
    q: 'Can I customize sync frequency?',
    a: 'Yes. You can set the frequency to Manual, Hourly, Daily, or Weekly in Project Settings → Smart Sync. The default is Manual.',
  },
];

const TICKETS = [
  { id: '1042', title: 'Smart Sync not triggering', status: 'IN PROGRESS', statusClass: 'pink' },
  { id: '1039', title: 'API schema mismatch', status: 'RESOLVED', statusClass: 'green' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="workspace-row flex flex-col items-start cursor-pointer select-none"
      onClick={() => setOpen((v) => !v)}
    >
      <div className="flex items-center justify-between w-full">
        <b className="text-sm text-text-primary dark:text-inverse-on-surface">{q}</b>
        <span className="flex-shrink-0 text-text-secondary dark:text-outline-variant">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </div>
      {open && (
        <p className="text-xs text-text-secondary dark:text-[#cbc3d7] mt-2 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredFaqs = search.trim()
    ? FAQ_ITEMS.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : FAQ_ITEMS;

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
              className="material-symbols-outlined absolute left-3 text-text-secondary dark:text-outline-variant pointer-events-none select-none"
              style={{ fontSize: '18px' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="support-search"
              className="w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm text-text-primary dark:text-inverse-on-surface placeholder:text-text-secondary dark:placeholder:text-outline-variant font-body-md"
            />
          </div>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="panel feature-panel">
            <div className="feature-icon">
              <Mail size={22} />
            </div>
            <div>
              <span className="eyebrow">EMAIL</span>
              <h2 className="text-base font-bold text-text-primary dark:text-inverse-on-surface my-1">Email Support</h2>
              <p className="text-sm text-text-secondary dark:text-outline-variant">support@thally.io — response within 24h</p>
            </div>
          </div>

          <div className="panel feature-panel">
            <div className="feature-icon">
              <MessageCircle size={22} />
            </div>
            <div>
              <span className="eyebrow">LIVE CHAT</span>
              <h2 className="text-base font-bold text-text-primary dark:text-inverse-on-surface my-1">Live Chat</h2>
              <p className="text-sm text-text-secondary dark:text-outline-variant">Chat with our team — avg response 5 min</p>
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-text-secondary dark:text-outline-variant mb-3">
            Frequently Asked Questions
          </h3>
          <div className="panel workspace-grid">
            {filteredFaqs.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* Open tickets */}
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-text-secondary dark:text-outline-variant mb-3">
            Open Tickets
          </h3>
          <div className="panel workspace-grid">
            {TICKETS.map((t, i) => (
              <div className="workspace-row" key={t.id} data-testid={`ticket-row-${i}`}>
                <span className="row-index">#{t.id}</span>
                <div>
                  <b className="text-text-primary dark:text-inverse-on-surface">{t.title}</b>
                  <small className="text-text-secondary dark:text-outline-variant">Ticket #{t.id}</small>
                </div>
                <span className={`row-state ${t.statusClass}`}>{t.status}</span>
              </div>
            ))}
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
