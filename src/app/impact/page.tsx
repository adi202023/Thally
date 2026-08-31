'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImpactDetailsPage() {
  const router = useRouter();
  const [decision, setDecision] = useState<'none' | 'approved' | 'rejected' | 'editing'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedCode, setEditedCode] = useState(`export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Fast path: JWT verification before DB lookup
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};`);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('Requires additional rate-limiting middleware before hitting JWT verification.');

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDecision('approved');
      showToast('Proposal PR-4092 approved! Deployment preview generated in staging.', 'success');
    }, 600);
  };

  const handleRejectConfirm = () => {
    setRejectModalOpen(false);
    setDecision('rejected');
    showToast(`Proposal rejected: "${rejectReason}"`, 'error');
  };

  const handleSaveEdit = () => {
    setEditModalOpen(false);
    setDecision('none');
    showToast('Code modifications saved to PR-4092 proposal draft.', 'info');
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl backdrop-blur-md border flex items-center gap-3 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                : toastMessage.type === 'error'
                ? 'bg-red-500/15 text-red-500 border-red-500/30'
                : 'bg-primary/15 text-primary dark:text-[#63f5ff] border-primary/30'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toastMessage.type === 'success' ? 'check_circle' : toastMessage.type === 'error' ? 'cancel' : 'info'}
            </span>
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Edit Code Modal */}
      {editModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setEditModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary dark:text-[#63f5ff] text-[22px]">edit_note</span>
                <h3 className="text-base font-bold text-foreground">Edit Proposal Code</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Modify the proposed implementation directly before approving or generating staging documentation.</span>
              <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-muted border border-border text-foreground">
                src/middleware/auth.ts
              </span>
            </div>

            {/* High-Contrast Code Editor Window */}
            <div className="rounded-xl border border-[#30363d] bg-[#0d1117] overflow-hidden shadow-inner">
              <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  <span className="text-[11px] font-mono text-[#8b949e] ml-2">TypeScript</span>
                </div>
                <span className="text-[10px] font-mono text-[#8b949e]">UTF-8</span>
              </div>

              <textarea
                rows={11}
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                className="w-full font-mono text-xs p-4 bg-[#0d1117] text-[#e6edf3] outline-none border-none resize-none leading-relaxed selection:bg-[#264f78] selection:text-white"
                spellCheck={false}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border bg-transparent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-bold text-background bg-foreground hover:opacity-90 rounded-lg border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setRejectModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-red-500 text-[22px]">gpp_bad</span>
                <h3 className="text-base font-bold text-foreground">Reject Proposal PR-4092</h3>
              </div>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer border-none bg-transparent"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Provide feedback for the author detailing why this proposed change cannot be merged into production docs.
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs p-3.5 rounded-xl border border-border bg-muted/60 text-foreground outline-none focus:border-red-500 transition-colors resize-none leading-relaxed"
              placeholder="Enter rejection rationale..."
            />

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border bg-transparent cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg border-none cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Canvas */}
      <main className="min-h-screen px-4 md:px-10 py-8 pb-32">
        {/* Status Alert Banner if Decision Made */}
        {decision === 'approved' && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-500 text-2xl">check_circle</span>
              <div>
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 m-0">
                  PR-4092 Approved & Deployed to Staging
                </h4>
                <p className="text-xs text-muted-foreground m-0 mt-0.5">
                  Knowledge synthesis complete · 3 documentation artifacts updated · Deployment preview active
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/preview"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold no-underline transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>View Staging Preview</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
              <button
                onClick={() => setDecision('none')}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground bg-transparent cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {decision === 'rejected' && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
              <div>
                <h4 className="text-sm font-bold text-red-600 dark:text-red-400 m-0">
                  PR-4092 Marked as Rejected
                </h4>
                <p className="text-xs text-muted-foreground m-0 mt-0.5">
                  Reason: {rejectReason}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDecision('none')}
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground bg-transparent cursor-pointer"
            >
              Reopen Review
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-section-gap fade-in-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`font-mono-data text-label-caps px-2.5 py-1 rounded-full border text-xs font-bold ${
                    decision === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : decision === 'rejected'
                      ? 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30'
                      : 'bg-primary/10 dark:bg-primary-fixed/20 text-primary dark:text-primary-fixed border-primary/20 dark:border-primary-fixed/30'
                  }`}
                >
                  {decision === 'approved'
                    ? 'PR-4092 · APPROVED'
                    : decision === 'rejected'
                    ? 'PR-4092 · REJECTED'
                    : 'PR-4092 · UNDER REVIEW'}
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
                  <div className={`w-2 h-2 rounded-full ${decision === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="font-headline-lg-mobile text-text-primary dark:text-inverse-on-surface font-semibold">
                    {decision === 'approved' ? 'Resolved' : 'Moderate'}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded border border-border bg-background/60 hover:bg-muted text-foreground transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">edit</span>
                    Edit Patch
                  </button>
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
                      className="fill-[#0f172a] dark:fill-[#1e293b] stroke-emerald-500/80 dark:stroke-emerald-400"
                      strokeWidth="1.5"
                      filter="url(#glow)"
                    />
                    <circle cx="-62" cy="0" r="4" className="fill-emerald-400 animate-ping opacity-75" />
                    <circle cx="-62" cy="0" r="3.5" className="fill-emerald-400" />
                    <text
                      x="-48"
                      y="4"
                      className="fill-white dark:fill-[#f8fafc] font-mono text-[11px] font-bold tracking-tight"
                    >
                      Auth Middleware
                    </text>
                    <rect
                      x="40"
                      y="-10"
                      width="32"
                      height="18"
                      rx="4"
                      className="fill-emerald-500/20 dark:fill-emerald-400/20"
                    />
                    <text
                      x="56"
                      y="3"
                      textAnchor="middle"
                      className="fill-emerald-400 dark:fill-emerald-300 font-mono text-[9px] font-bold"
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
      <nav className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-card/95 dark:bg-[#111216]/95 backdrop-blur-xl border border-border shadow-2xl rounded-full w-fit max-w-[calc(100vw-24px)] mx-auto transition-all">
        {/* Edit Button */}
        <button
          onClick={() => setEditModalOpen(true)}
          className="text-foreground hover:bg-muted px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 font-mono text-xs font-semibold rounded-full transition-all cursor-pointer border-none bg-transparent active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          <span>Edit</span>
        </button>

        {/* Approve Button */}
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className={`rounded-full px-6 py-2.5 flex items-center gap-2 font-mono text-xs font-bold transition-all cursor-pointer border-none shadow-sm active:scale-95 ${
            decision === 'approved'
              ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isProcessing ? 'hourglass_top' : 'check_circle'}
          </span>
          <span>{isProcessing ? 'Approving...' : decision === 'approved' ? 'Approved' : 'Approve'}</span>
        </button>

        {/* Reject Button */}
        <button
          onClick={() => setRejectModalOpen(true)}
          className={`px-5 py-2.5 flex items-center gap-2 font-mono text-xs font-semibold rounded-full transition-all cursor-pointer border-none active:scale-95 ${
            decision === 'rejected'
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'text-red-500 dark:text-red-400 hover:bg-red-500/10 bg-transparent'
          }`}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cancel
          </span>
          <span>{decision === 'rejected' ? 'Rejected' : 'Reject'}</span>
        </button>
      </nav>
    </>
  );
}
