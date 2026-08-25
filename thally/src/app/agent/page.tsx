'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  Bot,
  FileCode2,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Header } from '@/components/WorkspaceView';

export default function AgentPage() {
  const [query, setQuery] = useState('How do I enable Smart Sync?');
  const [asked, setAsked] = useState(false);

  return (
    <>
      <Header
        eyebrow="agent / knowledge"
        title="Ask the product."
        subtitle="Query structured context extracted from approved documentation — with provenance attached."
        action={{
          label: 'Re-sync knowledge',
          icon: <Activity size={15} />,
          onClick: () => setAsked(false),
        }}
        actionTestId="resync-knowledge-button"
      />

      <div className="page-content">
        <div className="agent-hero">
          <div className="agent-orb">
            <Bot size={30} />
          </div>

          <div>
            <span className="eyebrow">AGENT KNOWLEDGE · v1.1.0</span>
            <h2>Answers with receipts.</h2>
            <p>47 chunks · 8 pages · 100% citation coverage</p>
          </div>
        </div>

        <form
          className="query-box"
          onSubmit={(event) => {
            event.preventDefault();
            setAsked(true);
          }}
        >
          <Bot size={20} />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            data-testid="agent-query-input"
          />

          <button data-testid="agent-submit-button" type="submit">
            <Send size={15} />
            Ask agent
          </button>
        </form>

        <div className="suggestions">
          {[
            'What permissions are required?',
            'What sync frequencies exist?',
            'Does it sync all docs?',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              data-testid={`suggestion-${suggestion
                .slice(0, 8)
                .replaceAll(' ', '-')}`}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <section
          className="panel answer-panel"
          data-testid="agent-answer-panel"
        >
          <div className="answer-header">
            <span className="agent-orb small">
              <Bot size={16} />
            </span>

            <b>Agent response</b>

            <span className="status-badge">VERIFIED · 2 citations</span>
          </div>

          <div className="answer-body">
            <h3>
              {asked
                ? 'Smart Sync configuration'
                : 'Smart Sync lets you automatically synchronize the documentation sources you select.'}
            </h3>

            <ol>
              <li>
                Open <b>Project Settings</b>
              </li>
              <li>
                Choose <b>Smart Sync</b> and select documentation sources
              </li>
              <li>
                Select a frequency: Manual, Hourly, Daily, or Weekly
              </li>
              <li>
                Click <b>Enable Smart Sync</b>
              </li>
            </ol>

            <div className="citation-grid">
              <Link
                href="/docs"
                className="citation"
                data-testid="citation-smart-sync"
              >
                <FileCode2 size={15} />

                <span>
                  <b>Smart Sync Guide</b>
                  <small>“the documentation sources you select”</small>
                </span>

                <ArrowUpRight size={13} />
              </Link>

              <Link
                href="/docs"
                className="citation"
                data-testid="citation-permissions"
              >
                <ShieldCheck size={15} />

                <span>
                  <b>Permissions & scopes</b>
                  <small>“requires the project:write scope”</small>
                </span>

                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
