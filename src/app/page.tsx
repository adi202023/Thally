'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [syncing, setSyncing] = useState(false);
  const [evidenceCount, setEvidenceCount] = useState(14);
  const [activeAction, setActiveAction] = useState('review');

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setEvidenceCount((prev) => prev + 1);
    }, 1200);
  };

  return (
    <>
      <main className="md:ml-20 min-h-screen px-4 md:px-margin-page py-section-gap max-w-[1400px] mx-auto pb-32">
        {/* Dashboard Header */}
        <header className="mb-12 fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 dark:bg-primary-fixed-dim/20 text-primary dark:text-primary-fixed-dim rounded-full font-label-caps text-label-caps border border-primary/20 dark:border-primary-fixed-dim/30">
              System Status: Optimal
            </span>
          </div>
          <h1 className="font-display-hero text-headline-lg-mobile md:text-display-hero text-text-primary dark:text-inverse-on-surface mb-4">
            Intelligent Documentation Engine
          </h1>
          <p className="font-body-md text-body-md text-text-secondary dark:text-outline-variant max-w-2xl">
            Visualizing the flow from raw code changes to synthesized knowledge.
            Thally agents are actively monitoring your ecosystem.
          </p>
        </header>

        {/* Visual Story: Code -> Change -> Knowledge */}
        <section className="mb-section-gap fade-in-up stagger-1">
          <div className="glass-card rounded-xl p-card-padding relative overflow-hidden">
            {/* Abstract connection lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="path-animate"
                d="M 100,100 C 300,100 200,250 500,250"
                fill="none"
                stroke="rgba(107,56,212,0.4)"
                strokeDasharray="4 4"
                strokeWidth="2"
              />
              <path
                className="path-animate-reverse"
                d="M 500,250 C 700,250 800,100 1000,100"
                fill="none"
                stroke="rgba(79,70,229,0.4)"
                strokeDasharray="4 4"
                strokeWidth="2"
              />
            </svg>

            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-8 dark:text-inverse-on-surface">
              Synthesis Pipeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter relative z-10">
              {/* Node 1: Code */}
              <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-surface-container dark:bg-black/30 flex items-center justify-center mb-4 border border-border-subtle dark:border-white/10">
                  <span
                    className="material-symbols-outlined text-outline dark:text-outline-variant"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    code
                  </span>
                </div>
                <h3 className="font-label-caps text-label-caps text-text-primary dark:text-inverse-on-surface mb-2">
                  Code Ingestion
                </h3>
                <p className="font-mono-data text-mono-data text-text-secondary dark:text-outline-variant">
                  Monitoring GitHub &amp; GitLab repositories.
                </p>
              </div>

              {/* Node 2: Change */}
              <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 border border-primary/20 dark:border-primary/30">
                  <span
                    className="material-symbols-outlined text-primary dark:text-primary-fixed-dim"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    compare_arrows
                  </span>
                </div>
                <h3 className="font-label-caps text-label-caps text-text-primary dark:text-inverse-on-surface mb-2">
                  Change Analysis
                </h3>
                <p className="font-mono-data text-mono-data text-text-secondary dark:text-outline-variant">
                  14 evidence sources detected in last hour.
                </p>
              </div>

              {/* Node 3: Knowledge */}
              <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-full bg-accent-indigo/10 dark:bg-accent-indigo/20 flex items-center justify-center mb-4 border border-accent-indigo/20 dark:border-accent-indigo/30">
                  <span
                    className="material-symbols-outlined text-accent-indigo dark:text-inverse-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
                <h3 className="font-label-caps text-label-caps text-text-primary dark:text-inverse-on-surface mb-2">
                  Knowledge Graph
                </h3>
                <p className="font-mono-data text-mono-data text-text-secondary dark:text-outline-variant">
                  Smart Sync active. Structuring entities.
                </p>
              </div>

              {/* Node 4: Agent */}
              <div className="glass-card rounded-lg p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform border-primary/30 dark:border-primary/50 shadow-[0_0_15px_rgba(107,56,212,0.1)] dark:shadow-[0_0_20px_rgba(107,56,212,0.3)]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-indigo flex items-center justify-center mb-4 shadow-md">
                  <span
                    className="material-symbols-outlined text-white"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smart_toy
                  </span>
                </div>
                <h3 className="font-label-caps text-label-caps text-text-primary dark:text-inverse-on-surface mb-2">
                  Agent Action
                </h3>
                <p className="font-mono-data text-mono-data text-text-secondary dark:text-outline-variant">
                  Drafting documentation updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid for Data */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap fade-in-up stagger-2">
          {/* Smart Sync Status */}
          <div className="glass-card rounded-xl p-card-padding md:col-span-8 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-headline-lg text-headline-lg-mobile text-text-primary dark:text-inverse-on-surface">
                  Smart Sync Status
                </h3>
                <span className="px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded font-mono-data text-mono-data border border-green-500/20 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-label-caps text-label-caps text-text-secondary dark:text-outline-variant mb-1">
                    Evidence Sources
                  </p>
                  <p className="font-display-hero text-display-hero text-primary dark:text-primary-fixed-dim bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-indigo dark:from-primary-fixed-dim dark:to-inverse-primary">
                    {evidenceCount}
                  </p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-text-secondary dark:text-outline-variant mb-1">
                    Knowledge Areas
                  </p>
                  <p className="font-display-hero text-display-hero text-text-primary dark:text-inverse-on-surface">
                    128
                  </p>
                </div>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleForceSync}
              disabled={syncing}
              className="magnetic-btn w-fit mt-4 bg-gradient-to-r from-primary to-accent-indigo text-white rounded-full px-8 py-4 flex items-center gap-3 font-bold shadow-[0_0_20px_rgba(107,56,212,0.3)] hover:shadow-[0_0_30px_rgba(107,56,212,0.5)] transition-all group/btn border border-white/20 cursor-pointer disabled:opacity-75"
            >
              <span>{syncing ? 'Syncing...' : 'Force Sync Now'}</span>
              <span
                className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                arrow_forward
              </span>
            </button>
          </div>

          {/* Recent Activity List */}
          <div className="glass-card rounded-xl p-card-padding md:col-span-4">
            <h3 className="font-body-md font-bold text-text-primary dark:text-inverse-on-surface mb-4 border-b border-border-subtle dark:border-white/10 pb-2">
              Recent Agent Activity
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="font-body-sm text-body-sm text-text-primary dark:text-inverse-on-surface font-medium">
                    Updated Auth Flow Docs
                  </p>
                  <p className="font-mono-data text-[10px] text-text-secondary dark:text-outline-variant">
                    Based on PR #442 • 10m ago
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-accent-indigo flex-shrink-0" />
                <div>
                  <p className="font-body-sm text-body-sm text-text-primary dark:text-inverse-on-surface font-medium">
                    Generated API Schema
                  </p>
                  <p className="font-mono-data text-[10px] text-text-secondary dark:text-outline-variant">
                    From backend/routes.ts • 1h ago
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-outline dark:bg-outline-variant flex-shrink-0" />
                <div>
                  <p className="font-body-sm text-body-sm text-text-primary dark:text-inverse-on-surface font-medium">
                    Ingested Confluence Pages
                  </p>
                  <p className="font-mono-data text-[10px] text-text-secondary dark:text-outline-variant">
                    3 pages synced • 2h ago
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* BottomNavBar Shared Component */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-glass-surface dark:bg-inverse-surface/80 backdrop-blur-lg border border-white/40 dark:border-white/10 shadow-lg docked rounded-full w-fit mx-auto font-label-caps text-label-caps transition-colors duration-300">
        <Link
          href="/review"
          onClick={() => setActiveAction('review')}
          className={`no-underline rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300 active:scale-90 ${
            activeAction === 'review'
              ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container shadow-[0_0_15px_rgba(107,56,212,0.4)] hover:scale-105'
              : 'text-text-secondary dark:text-outline-variant hover:text-text-primary dark:hover:text-inverse-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="rate_review"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            rate_review
          </span>
          Review
        </Link>

        <button
          onClick={() => setActiveAction('approve')}
          className={`no-underline rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300 active:scale-90 cursor-pointer ${
            activeAction === 'approve'
              ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container shadow-[0_0_15px_rgba(107,56,212,0.4)] hover:scale-105'
              : 'text-text-secondary dark:text-outline-variant hover:text-text-primary dark:hover:text-inverse-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="check_circle"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            check_circle
          </span>
          Approve
        </button>

        <Link
          href="/preview"
          onClick={() => setActiveAction('publish')}
          className={`no-underline rounded-full px-6 py-3 flex items-center gap-2 transition-all duration-300 active:scale-90 ${
            activeAction === 'publish'
              ? 'bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container shadow-[0_0_15px_rgba(107,56,212,0.4)] hover:scale-105'
              : 'text-text-secondary dark:text-outline-variant hover:text-text-primary dark:hover:text-inverse-on-surface hover:bg-surface-container-low'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            data-icon="send"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            send
          </span>
          Publish
        </Link>
      </nav>
    </>
  );
}
