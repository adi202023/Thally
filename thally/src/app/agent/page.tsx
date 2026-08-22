'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Layers,
  FileText,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { Badge } from '@/components/design-system/Badge';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/design-system/Card';
import { WorkflowPipeline } from '@/components/pipeline/WorkflowPipeline';

export default function AgentKnowledgePage() {
  const [query, setQuery] = useState('How do I enable Smart Sync?');
  const [isQuerying, setIsQuerying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(true);
  const [comparisonMode, setComparisonMode] = useState<'after' | 'before'>('after');

  const [response, setResponse] = useState({
    answer: `Smart Sync lets you automatically synchronize **the documentation sources you select** with your connected product repository.

**To enable Smart Sync:**
1. Open **Project Settings**
2. Select **Smart Sync**
3. Choose the documentation sources you want to synchronize
4. Select a synchronization frequency (Manual, Hourly, Daily, or Weekly)
5. Click **Enable Smart Sync**

**Note:** Enabling Smart Sync requires the \`project:write\` scope. Users with Viewer or Editor roles cannot modify sync configuration.`,
    citations: [
      {
        pageTitle: 'Smart Sync Guide',
        pageSlug: 'smart-sync',
        excerpt: 'Smart Sync lets you automatically synchronize the documentation sources you select with your connected product repository.',
      },
      {
        pageTitle: 'Permissions & Scopes',
        pageSlug: 'permissions',
        excerpt: 'Smart Sync configuration requires the project:write scope.',
      },
    ],
  });

  const handleQuery = async (queryText: string) => {
    setQuery(queryText);
    setIsQuerying(true);
    try {
      const res = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });
      const data = await res.json();
      if (data.result) {
        setResponse(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSyncKnowledge = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/agent/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: 'project-demo-001' }),
      });
      setSyncDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const exampleQueries = [
    'How do I enable Smart Sync?',
    'What permissions are required for Smart Sync?',
    'What sync frequencies are available?',
    'Does Smart Sync sync all documentation or only selected sources?',
  ];

  return (
    <div className="flex-1 flex flex-col">
      <header className="page-header">
        <div>
          <div className="breadcrumbs">
            <Link href="/">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-primary font-medium">Agent Knowledge</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Agent Knowledge System</h1>
            <Badge variant="purple">Demo Agent Provider</Badge>
            <Badge variant="success" dot>Synchronized (v1.1.0)</Badge>
          </div>
          <p className="page-subtitle">
            Query structured agent context extracted from approved documentation and inspect citation provenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            isLoading={isSyncing}
            onClick={handleSyncKnowledge}
            leftIcon={<RefreshCw size={14} />}
          >
            Re-Sync Knowledge Chunks
          </Button>
          <Link href="/verification">
            <Button variant="primary" size="sm" rightIcon={<CheckCircle2 size={14} />}>
              Final Verification Screen →
            </Button>
          </Link>
        </div>
      </header>

      <main className="page-content flex flex-col gap-6">
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg">
          <WorkflowPipeline currentStage="agent" />
        </div>

        {/* Indexing Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <Layers size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Knowledge Version</span>
                <span className="font-semibold text-sm">v1.1.0 (Active)</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-success">
                <BookOpen size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Pages Indexed</span>
                <span className="font-semibold text-sm">8 Pages</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-purple-600">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Chunks Indexed</span>
                <span className="font-semibold text-sm">47 Structured Chunks</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center text-brand">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-xs text-tertiary block">Source Commit</span>
                <span className="font-mono font-semibold text-sm">a3f8c2d</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Before vs After Publication Simulation Toggle */}
        <div className="p-4 bg-surface-0 border border-subtle rounded-lg flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm text-primary block">Demonstration State Comparison</span>
            <span className="text-xs text-secondary">
              Observe how the Agent Knowledge responds before vs after the Smart Sync documentation publication.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparisonMode('before')}
              className={`btn btn-xs ${comparisonMode === 'before' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Before Publication (v1.0.0)
            </button>
            <button
              onClick={() => setComparisonMode('after')}
              className={`btn btn-xs ${comparisonMode === 'after' ? 'btn-success' : 'btn-secondary'}`}
            >
              After Publication (v1.1.0)
            </button>
          </div>
        </div>

        {/* Query Input Box */}
        <div className="agent-query-box">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuery(query);
            }}
            className="flex items-center p-3 gap-3"
          >
            <Bot size={20} className="text-brand flex-shrink-0 ml-2" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-sm text-primary"
              placeholder="Ask a question about the product or documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isQuerying}
              leftIcon={<Send size={14} />}
            >
              Ask Agent
            </Button>
          </form>

          <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-tertiary font-medium">Examples:</span>
            {exampleQueries.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleQuery(ex)}
                className="text-xs px-2.5 py-1 bg-surface-1 hover:bg-surface-2 border border-subtle rounded-full text-secondary hover:text-primary transition-all whitespace-nowrap"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Agent Answer Frame */}
        <Card className="overflow-hidden">
          <div className="agent-answer-header">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-brand" />
              <span className="font-semibold text-sm">Agent Response</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="purple">Demo Agent Provider</Badge>
              <Badge variant={comparisonMode === 'after' ? 'success' : 'warning'}>
                {comparisonMode === 'after' ? 'v1.1.0 Knowledge Active' : 'Pre-publication Knowledge'}
              </Badge>
            </div>
          </div>

          <CardBody className="flex flex-col gap-5 p-6">
            {comparisonMode === 'before' ? (
              <div className="p-4 bg-surface-1 border border-subtle rounded-lg text-sm text-secondary">
                <em>&quot;I don&apos;t have enough information to explain Smart Sync. The relevant documentation has not been published yet.&quot;</em>
              </div>
            ) : (
              <div className="text-sm text-primary leading-relaxed whitespace-pre-wrap docs-prose">
                {response.answer}
              </div>
            )}

            {/* Citations section */}
            {comparisonMode === 'after' && (
              <div>
                <span className="text-xs font-bold text-tertiary uppercase tracking-wider block mb-2">
                  Traceable Citation Sources (Verified Documentation)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {response.citations.map((cite, idx) => (
                    <Link
                      key={idx}
                      href={`/docs/${cite.pageSlug}`}
                      className="p-3 bg-surface-1 hover:bg-brand-50 border border-subtle hover:border-brand-200 rounded-lg no-underline transition-all flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-brand">
                        <span>{cite.pageTitle}</span>
                        <ExternalLink size={12} />
                      </div>
                      <p className="text-xs text-secondary italic">
                        &quot;{cite.excerpt}&quot;
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
