'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ImpactDetailsPage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'deployments'>('analysis');
  const [decision, setDecision] = useState<'none' | 'approved' | 'rejected' | 'editing'>('none');

  return (
    <>
      {/* Main Content Canvas */}
      <main className="min-h-screen px-4 md:px-10 py-8 pb-32">
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
            {/* Topological Map Card */}
            <div className="glass-card rounded-xl p-5 flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 z-10">
                <h3 className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface flex items-center gap-2 font-bold text-base">
                  <span className="material-symbols-outlined text-primary dark:text-primary-fixed">
                    hub
                  </span>
                  Dependency Impact
                </h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim border border-primary/20">
                  3 Connected
                </span>
              </div>

              <p className="text-xs text-text-secondary dark:text-[#a0a5ab] mb-4 z-10">
                Visualizing blast radius from <span className="font-mono text-primary dark:text-[#d0bcff]">auth.ts</span> modifications.
              </p>

              {/* Topological Graph Canvas */}
              <div className="relative w-full rounded-xl bg-surface-container-lowest/50 dark:bg-[#121316]/60 border border-border-subtle dark:border-white/5 p-4 flex flex-col items-center">
                
                {/* SVG Connecting Lines - Responsive viewBox 0 0 340 260 */}
                <svg
                  viewBox="0 0 340 260"
                  className="w-full h-auto max-h-[300px] select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="lineGradPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#71717a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="lineGradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#71717a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="lineGradRose" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#71717a" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Connecting Paths */}
                  {/* Auth Middleware -> API Gateway (Left) */}
                  <path
                    d="M 170 55 C 170 100, 75 90, 75 125"
                    fill="none"
                    stroke="url(#lineGradPrimary)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="path-animate"
                  />

                  {/* Auth Middleware -> User Service (Right) */}
                  <path
                    d="M 170 55 C 170 100, 265 90, 265 125"
                    fill="none"
                    stroke="url(#lineGradIndigo)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="path-animate"
                  />

                  {/* User Service & Center -> Checkout Flow (Bottom) */}
                  <path
                    d="M 170 55 L 170 200"
                    fill="none"
                    stroke="url(#lineGradRose)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    className="path-animate-reverse"
                  />

                  {/* ── Node 1: Auth Middleware (Root / Center Top) ── */}
                  <g transform="translate(170, 32)">
                    <rect
                      x="-80"
                      y="-18"
                      width="160"
                      height="36"
                      rx="8"
                      className="fill-foreground stroke-border"
                      strokeWidth="1.5"
                      filter="url(#glow)"
                    />
                    <circle cx="-62" cy="0" r="4" className="fill-green-400 animate-ping opacity-75" />
                    <circle cx="-62" cy="0" r="3.5" className="fill-green-400" />
                    <text
                      x="-48"
                      y="4"
                      className="fill-white font-mono text-[11px] font-bold tracking-tight"
                    >
                      Auth Middleware
                    </text>
                    <rect
                      x="40"
                      y="-10"
                      width="32"
                      height="18"
                      rx="4"
                      className="fill-white/20"
                    />
                    <text
                      x="56"
                      y="3"
                      textAnchor="middle"
                      className="fill-white font-mono text-[9px] font-bold"
                    >
                      PR
                    </text>
                  </g>

                  {/* ── Node 2: API Gateway (Left Middle) ── */}
                  <g transform="translate(75, 145)">
                    <rect
                      x="-65"
                      y="-20"
                      width="130"
                      height="40"
                      rx="8"
                      className="fill-white dark:fill-[#1e2028] stroke-amber-400 dark:stroke-amber-500/60"
                      strokeWidth="1.5"
                    />
                    <circle cx="-46" cy="-2" r="3" className="fill-amber-500" />
                    <text
                      x="-34"
                      y="2"
                      className="fill-text-primary dark:fill-[#e5e7eb] font-mono text-[10px] font-semibold"
                    >
                      API Gateway
                    </text>
                    <text
                      x="-46"
                      y="14"
                      className="fill-amber-600 dark:fill-amber-400 font-mono text-[8px] font-medium"
                    >
                      Latency: -12ms
                    </text>
                  </g>

                  {/* ── Node 3: User Service (Right Middle) ── */}
                  <g transform="translate(265, 145)">
                    <rect
                      x="-65"
                      y="-20"
                      width="130"
                      height="40"
                      rx="8"
                      className="fill-white dark:fill-[#1e2028] stroke-primary/30 dark:stroke-primary/50"
                      strokeWidth="1.5"
                    />
                    <circle cx="-46" cy="-2" r="3" className="fill-primary dark:fill-[#a78bfa]" />
                    <text
                      x="-34"
                      y="2"
                      className="fill-text-primary dark:fill-[#e5e7eb] font-mono text-[10px] font-semibold"
                    >
                      User Service
                    </text>
                    <text
                      x="-46"
                      y="14"
                      className="fill-text-secondary dark:fill-[#a0a5ab] font-mono text-[8px] font-medium"
                    >
                      JWT Consumer
                    </text>
                  </g>

                  {/* ── Node 4: Checkout Flow (Bottom Center) ── */}
                  <g transform="translate(170, 225)">
                    <rect
                      x="-70"
                      y="-20"
                      width="140"
                      height="40"
                      rx="8"
                      className="fill-white dark:fill-[#1e2028] stroke-border-subtle dark:stroke-white/10"
                      strokeWidth="1.5"
                    />
                    <circle cx="-52" cy="-2" r="3" className="fill-rose-500" />
                    <text
                      x="-40"
                      y="2"
                      className="fill-text-primary dark:fill-[#e5e7eb] font-mono text-[10px] font-semibold"
                    >
                      Checkout Flow
                    </text>
                    <text
                      x="-52"
                      y="14"
                      className="fill-text-secondary dark:fill-[#a0a5ab] font-mono text-[8px] font-medium"
                    >
                      Downstream Impact
                    </text>
                  </g>
                </svg>
              </div>

              {/* Legend & Meta details */}
              <div className="mt-4 pt-3 border-t border-border-subtle dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-text-secondary dark:text-outline-variant">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Source Node
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Direct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Cascading
                </span>
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
