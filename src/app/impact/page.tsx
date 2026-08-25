'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ImpactDetailsPage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'deployments'>('analysis');
  const [decision, setDecision] = useState<'none' | 'approved' | 'rejected' | 'editing'>('none');

  return (
    <>
      {/* Main Content Canvas */}
      <main className="md:ml-20 w-full max-w-[1400px] mx-auto px-4 md:px-margin-page py-8 pb-32">
        {/* Header Section */}
        <div className="mb-section-gap fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono-data text-label-caps bg-primary/10 dark:bg-primary-fixed/20 text-primary dark:text-primary-fixed px-2.5 py-1 rounded-full border border-primary/20 dark:border-primary-fixed/30">
                  PR-4092
                </span>
                <span className="text-text-secondary dark:text-[#a0a5ab] font-medium text-xs">
                  Updated 2m ago
                </span>
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-text-primary dark:text-inverse-on-surface">
                Update authentication middleware logic
              </h1>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 bg-surface-container dark:bg-white/5 rounded-lg px-3 py-1.5 border border-border-subtle dark:border-white/10">
                <span
                  className="material-symbols-outlined text-outline dark:text-outline-variant"
                  style={{ fontSize: '18px' }}
                >
                  account_circle
                </span>
                <span className="text-text-primary dark:text-[#e5e7eb]">
                  alex.dev
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-surface-container dark:bg-white/5 rounded-lg px-3 py-1.5 border border-border-subtle dark:border-white/10">
                <span
                  className="material-symbols-outlined text-outline dark:text-outline-variant"
                  style={{ fontSize: '18px' }}
                >
                  commit
                </span>
                <span className="font-mono-data text-text-primary dark:text-[#e5e7eb] text-xs">
                  a7b2c9f
                </span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary dark:text-[#a0a5ab] max-w-3xl leading-relaxed">
            Refactors the JWT validation flow to reduce database calls on unauthenticated routes. Impact analysis indicates moderate risk due to touching core auth services.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Code Details & Stats (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 fade-in-up stagger-1">
            {/* Metrics Bento */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="text-text-secondary dark:text-[#a0a5ab] text-sm font-medium">
                  Risk Level
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface font-semibold">
                    Moderate
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="text-text-secondary dark:text-[#a0a5ab] text-sm font-medium">
                  Services Touched
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface font-semibold">
                    3
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="text-text-secondary dark:text-[#a0a5ab] text-sm font-medium">
                  Test Coverage
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface font-semibold">
                    94%
                  </span>
                  <span className="text-green-600 dark:text-[#86efac] text-sm flex items-center">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '14px' }}
                    >
                      arrow_upward
                    </span>{' '}
                    1.2%
                  </span>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <span className="text-text-secondary dark:text-[#a0a5ab] text-sm font-medium">
                  Est. Latency Impact
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface font-semibold">
                    -12ms
                  </span>
                </div>
              </div>
            </div>

            {/* Code Diff Viewer */}
            <div className="glass-card rounded-xl overflow-hidden flex flex-col h-[500px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle dark:border-white/10 bg-white/30 dark:bg-black/20 hover:bg-white/40">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline dark:text-outline-variant">
                    description
                  </span>
                  <span className="font-mono-data text-text-primary dark:text-[#e5e7eb] text-sm font-medium">
                    src/middleware/auth.ts
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono-data text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-[#86efac] rounded font-bold">
                    +12
                  </span>
                  <span className="font-mono-data text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-[#fca5a5] rounded font-bold">
                    -4
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scroll p-4 font-mono-data text-sm leading-relaxed bg-surface-container-lowest/50 dark:bg-[#121316]/50">
                {/* Simulated Code Diff */}
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  {/* Line Numbers */}
                  <div className="text-outline dark:text-outline-variant text-right select-none opacity-50 flex flex-col font-mono text-xs">
                    <span>42</span>
                    <span>43</span>
                    <span>44</span>
                    <span>45</span>
                    <span>46</span>
                    <span>47</span>
                    <span>48</span>
                    <span>49</span>
                    <span>50</span>
                    <span>51</span>
                    <span>52</span>
                    <span>53</span>
                    <span>54</span>
                  </div>

                  {/* Code Content */}
                  <div className="flex flex-col whitespace-pre font-mono text-xs leading-6">
                    <span className="text-text-primary dark:text-[#e5e7eb]">
                      export const validateToken = async (req: Request, res: Response, next: NextFunction) =&gt; &#123;
                    </span>
                    <span className="text-text-primary dark:text-[#e5e7eb]">
                      {'  '}const token = req.headers.authorization?.split(' ')[1];
                    </span>
                    <span className="text-text-primary dark:text-[#e5e7eb]">
                      {'  '}if (!token) return res.status(401).json(&#123; error: 'Unauthorized' &#125;);
                    </span>
                    <span className="text-text-primary dark:text-[#e5e7eb]" />
                    <span className="diff-removed block px-2 -mx-2 rounded">
                      {'  '}// Legacy validation flow
                    </span>
                    <span className="diff-removed block px-2 -mx-2 rounded">
                      {'  '}const user = await db.user.findByToken(token);
                    </span>
                    <span className="diff-removed block px-2 -mx-2 rounded">
                      {'  '}if (!user) return res.status(403).json(&#123; error: 'Invalid token' &#125;);
                    </span>
                    <span className="diff-removed block px-2 -mx-2 rounded">
                      {'  '}req.user = user;
                    </span>
                    <span className="diff-added block px-2 -mx-2 rounded">
                      {'  '}try &#123;
                    </span>
                    <span className="diff-added block px-2 -mx-2 rounded">
                      {'    '}// Fast path: JWT verification before DB lookup
                    </span>
                    <span className="diff-added block px-2 -mx-2 rounded">
                      {'    '}const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    </span>
                    <span className="diff-added block px-2 -mx-2 rounded">
                      {'    '}req.user = decoded;
                    </span>
                    <span className="text-text-primary dark:text-[#e5e7eb]">
                      {'    '}next();
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Impact Graph (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 fade-in-up stagger-2">
            {/* Topological Map */}
            <div className="glass-card rounded-xl p-card-padding h-full min-h-[400px] flex flex-col relative overflow-hidden">
              <h3 className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface mb-4 flex items-center gap-2 z-10 font-bold">
                <span className="material-symbols-outlined text-primary dark:text-primary-fixed">
                  hub
                </span>
                Dependency Impact
              </h3>

              <div className="flex-1 relative z-10 flex flex-col justify-center items-center gap-6 py-8">
                {/* Core Change Node */}
                <div className="bg-primary-container dark:bg-primary text-on-primary-container dark:text-white px-4 py-2 rounded-lg font-mono-data text-sm shadow-md border border-primary dark:border-primary-fixed/50 z-20 magnetic-btn cursor-pointer transition-transform">
                  Auth Middleware
                </div>

                {/* Connecting Lines (SVG) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  style={{ overflow: 'visible' }}
                >
                  <path
                    className="text-outline-variant dark:text-outline"
                    d="M 150 120 L 80 220"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="4"
                    strokeWidth="2"
                  />
                  <path
                    className="text-outline-variant dark:text-outline"
                    d="M 150 120 L 220 220"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="4"
                    strokeWidth="2"
                  />
                  <path
                    className="text-outline-variant dark:text-outline"
                    d="M 150 120 L 150 300"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="4"
                    strokeWidth="2"
                  />
                </svg>

                {/* Impacted Nodes */}
                <div className="flex justify-between w-full px-4 z-20 gap-2">
                  <div className="bg-surface dark:bg-[#25272c] text-text-primary dark:text-[#e5e7eb] px-3 py-2 rounded-lg font-mono-data text-xs border border-amber-300 dark:border-amber-500/50 shadow-sm flex flex-col items-center gap-1 magnetic-btn cursor-pointer">
                    <span
                      className="material-symbols-outlined text-amber-500"
                      style={{ fontSize: '16px' }}
                    >
                      api
                    </span>
                    API Gateway
                  </div>

                  <div className="bg-surface dark:bg-[#25272c] text-text-primary dark:text-[#e5e7eb] px-3 py-2 rounded-lg font-mono-data text-xs border border-outline-variant dark:border-white/10 shadow-sm flex flex-col items-center gap-1 magnetic-btn cursor-pointer opacity-70">
                    <span
                      className="material-symbols-outlined text-outline dark:text-outline-variant"
                      style={{ fontSize: '16px' }}
                    >
                      group
                    </span>
                    User Service
                  </div>
                </div>

                <div className="bg-surface dark:bg-[#25272c] text-text-primary dark:text-[#e5e7eb] px-3 py-2 rounded-lg font-mono-data text-xs border border-outline-variant dark:border-white/10 shadow-sm flex flex-col items-center gap-1 z-20 mt-4 magnetic-btn cursor-pointer opacity-70">
                  <span
                    className="material-symbols-outlined text-outline dark:text-outline-variant"
                    style={{ fontSize: '16px' }}
                  >
                    shopping_cart
                  </span>
                  Checkout Flow
                </div>
              </div>

              {/* Decorative Background Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 dark:bg-primary-fixed/5 rounded-full blur-3xl z-0 pointer-events-none" />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Floating Action Bar) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-glass-surface dark:bg-[#1e2024]/70 backdrop-blur-lg border border-white/40 dark:border-white/10 shadow-lg dark:shadow-black/30 docked rounded-full w-fit mx-auto transition-colors">
        <Link
          href="/review"
          onClick={() => setDecision('editing')}
          className="text-text-secondary dark:text-[#a0a5ab] px-6 py-3 flex items-center gap-2 font-label-caps text-label-caps hover:scale-105 transition-all duration-300 active:scale-90 rounded-full hover:bg-surface-variant/50 dark:hover:bg-white/5 cursor-pointer no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Edit
        </Link>

        <button
          onClick={() => setDecision('approved')}
          className={`rounded-full px-6 py-3 flex items-center gap-2 font-label-caps text-label-caps hover:scale-105 transition-all duration-300 active:scale-90 cursor-pointer ${
            decision === 'approved'
              ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
              : 'bg-primary-container dark:bg-primary text-on-primary-container dark:text-white shadow-[0_0_15px_rgba(107,56,212,0.4)] dark:shadow-[0_0_15px_rgba(233,221,255,0.2)]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {decision === 'approved' ? 'Approved' : 'Approve'}
        </button>

        <button
          onClick={() => setDecision('rejected')}
          className="text-error dark:text-[#ffb4ab] px-6 py-3 flex items-center gap-2 font-label-caps text-label-caps hover:scale-105 transition-all duration-300 active:scale-90 rounded-full hover:bg-error-container/50 dark:hover:bg-error/20 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cancel
          </span>
          Reject
        </button>
      </nav>
    </>
  );
}
