'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ThallyLogo } from '@/components/ui/ThallyLogo';

// Shared hook: close a panel when clicking outside its ref
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// Toast notification system
function useToast() {
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'info' | 'error' }[]>([]);

  const toast = useCallback((msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return { toasts, toast };
}

// Search resources list with categories and descriptions
const SEARCH_RESOURCES = [
  { label: 'Dashboard', category: 'Pages', desc: 'Main control plane, synthesis pipeline, and metrics', href: '/dashboard', icon: 'dashboard' },
  { label: 'Impact Radar', category: 'Pages', desc: 'Topological service dependency graph and risk analysis', href: '/impact', icon: 'radar' },
  { label: 'Deployments', category: 'Pages', desc: 'Active documentation staging & preview environments', href: '/preview', icon: 'rocket_launch' },
  { label: 'Infrastructure', category: 'Pages', desc: 'Compute & storage cluster telemetry and node status', href: '/changes', icon: 'developer_board' },
  { label: 'Security & Verification', category: 'Pages', desc: 'Security protocols, compliance, and policy checks', href: '/verification', icon: 'shield_with_heart' },
  { label: 'Documentation Portal', category: 'Documentation', desc: 'Knowledge areas, specs, and product guides', href: '/docs', icon: 'menu_book' },
  { label: 'Smart Sync Guide', category: 'Documentation', desc: 'Connected repo sync setup and workflow guide', href: '/docs/smart-sync', icon: 'sync' },
  { label: 'Permissions & Scopes', category: 'Documentation', desc: 'RBAC scopes, access levels, and role definitions', href: '/docs/permissions', icon: 'key' },
  { label: 'Agent Knowledge', category: 'AI Agent', desc: 'Ask natural language questions with verified provenance citations', href: '/agent', icon: 'smart_toy' },
  { label: 'Audit Trail', category: 'Audit', desc: 'Historical change logs, telemetry, and version history', href: '/audit', icon: 'history' },
  { label: 'Engineering Review', category: 'Actions', desc: 'Review pending documentation proposals before publishing', href: '/review', icon: 'rate_review' },
  { label: 'Evidence Sources', category: 'Actions', desc: 'Inspect raw diffs and PR evidence detection', href: '/evidence', icon: 'search' },
  { label: 'Support & FAQs', category: 'Help', desc: 'Get help from the team or browse frequently asked questions', href: '/support', icon: 'help' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { toasts, toast } = useToast();

  // Mobile navigation drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Dropdown states
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(settingsRef, () => setSettingsOpen(false));
  useClickOutside(workspaceRef, () => setWorkspaceOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile drawer or command palette is open
  useEffect(() => {
    if (mobileDrawerOpen || cmdOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen, cmdOpen]);

  // Theme init
  useEffect(() => {
    const dark =
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  }, []);

  // ⌘K shortcut & ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
        setCmdQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.theme = next ? 'dark' : 'light';
    window.dispatchEvent(new Event('theme-change'));
    toast(next ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'Impact Radar', href: '/impact', icon: 'radar' },
    { label: 'Deployments', href: '/preview', icon: 'rocket_launch' },
    { label: 'Infrastructure', href: '/changes', icon: 'developer_board' },
    { label: 'Security', href: '/verification', icon: 'shield_with_heart' },
  ];

  const bottomNavItems = [
    { label: 'Docs', href: '/docs', icon: 'menu_book' },
    { label: 'Support', href: '/support', icon: 'help' },
  ];

  const filteredResources = SEARCH_RESOURCES.filter((c) =>
    c.label.toLowerCase().includes(cmdQuery.toLowerCase()) ||
    c.desc.toLowerCase().includes(cmdQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(cmdQuery.toLowerCase())
  );

  const handleSelectResource = (href: string) => {
    router.push(href);
    setCmdOpen(false);
    setCmdQuery('');
  };

  // Standalone layout for Landing Page (/ or /landing) and Login (/login)
  if (pathname === '/' || pathname === '/landing' || pathname === '/login') {
    return (
      <div className="min-h-screen bg-background text-foreground font-body-md antialiased transition-colors duration-300 relative">
        <AnimatedBackground variant="landing" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body-md antialiased transition-colors duration-300 relative">
      {/* Animated Knowledge Graph Background */}
      <AnimatedBackground variant="dashboard" />

      {/* ── TOAST NOTIFICATIONS ─────────────────────────────────────── */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-32px)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border pointer-events-auto transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : t.type === 'error'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                : 'bg-muted text-foreground border-border'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── SEARCH RESOURCES / COMMAND PALETTE MODAL ─────────────────── */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4 bg-black/70 backdrop-blur-md"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-border bg-muted/30 flex-shrink-0">
              <span
                className="material-symbols-outlined text-muted-foreground text-[20px] sm:text-[22px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                search
              </span>
              <input
                ref={searchInputRef}
                autoFocus
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground font-sans min-w-0"
                placeholder="Search resources, documents, actions..."
                value={cmdQuery}
                onChange={(e) => {
                  setCmdQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResources.length));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((prev) => (prev - 1 + filteredResources.length) % Math.max(1, filteredResources.length));
                  } else if (e.key === 'Enter' && filteredResources[selectedIndex]) {
                    handleSelectResource(filteredResources[selectedIndex].href);
                  } else if (e.key === 'Escape') {
                    setCmdOpen(false);
                  }
                }}
              />
              {cmdQuery && (
                <button
                  onClick={() => setCmdQuery('')}
                  className="text-xs text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded cursor-pointer border-none bg-transparent"
                >
                  Clear
                </button>
              )}
              <kbd className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 overscroll-contain">
              {filteredResources.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                  <p className="font-medium text-foreground">No resources found</p>
                  <p className="text-xs mt-1">No results matching &ldquo;{cmdQuery}&rdquo;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredResources.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.href + item.label}
                        onClick={() => handleSelectResource(item.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-foreground/10 text-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`grid size-8 sm:size-9 place-items-center rounded-lg border border-border flex-shrink-0 ${
                            isSelected ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                          }`}>
                            <span
                              className="material-symbols-outlined text-[18px] sm:text-[20px]"
                              style={{ fontVariationSettings: "'FILL' 0" }}
                            >
                              {item.icon}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground m-0 truncate">{item.label}</p>
                            <p className="text-xs text-muted-foreground m-0 truncate">{item.desc}</p>
                          </div>
                        </div>

                        <span className="flex-shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-border bg-muted/60 text-muted-foreground hidden sm:inline-block">
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground font-mono flex-shrink-0">
              <span>{filteredResources.length} resources</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:inline">↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE NAVIGATION DRAWER (Slide-out) ────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Sidebar Container */}
          <div className="fixed top-0 bottom-0 left-0 w-[82vw] max-w-[320px] bg-card border-r border-border shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 flex-shrink-0">
              <Link
                href="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2.5 no-underline text-foreground"
              >
                <ThallyLogo size={28} />
                <div>
                  <span className="font-bold text-base tracking-tight block leading-none">Thally</span>
                  <span className="text-[10px] font-mono text-muted-foreground">v2.4.0 · Control Plane</span>
                </div>
              </Link>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close navigation"
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border cursor-pointer bg-transparent"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Drawer Search Trigger Bar */}
            <div className="p-3 border-b border-border flex-shrink-0">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setCmdOpen(true);
                  setCmdQuery('');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/60 border border-border text-muted-foreground text-xs hover:text-foreground cursor-pointer text-left"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Search pages & docs...</span>
                <kbd className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-background border border-border">⌘K</kbd>
              </button>
            </div>

            {/* Drawer Scrollable Navigation Links */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-4">
              {/* Category: Core Workflow */}
              <div>
                <p className="px-2 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Core Workflow
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', desc: 'Main control plane' },
                    { label: 'Impact Radar', href: '/impact', icon: 'radar', desc: 'Dependency topology' },
                    { label: 'Deployments', href: '/preview', icon: 'rocket_launch', desc: 'Staging & previews' },
                    { label: 'Infrastructure', href: '/changes', icon: 'developer_board', desc: 'Cluster telemetry' },
                    { label: 'Security & Verify', href: '/verification', icon: 'shield_with_heart', desc: 'Verification pipeline' },
                  ].map((item) => {
                    const isActive = item.href === '/dashboard' ? pathname.startsWith('/dashboard') : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline ${
                          isActive
                            ? 'bg-foreground text-background font-bold shadow-sm'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px] flex-shrink-0"
                          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="leading-tight truncate">{item.label}</div>
                          <div className={`text-[10px] font-normal truncate ${isActive ? 'text-background/80' : 'text-muted-foreground'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Category: Knowledge & AI */}
              <div>
                <p className="px-2 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Knowledge & Intelligence
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'Documentation Portal', href: '/docs', icon: 'menu_book', desc: 'Guides & specs' },
                    { label: 'Agent Knowledge', href: '/agent', icon: 'smart_toy', desc: 'Ask AI with provenance' },
                  ].map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline ${
                          isActive
                            ? 'bg-foreground text-background font-bold shadow-sm'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px] flex-shrink-0"
                          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="leading-tight truncate">{item.label}</div>
                          <div className={`text-[10px] font-normal truncate ${isActive ? 'text-background/80' : 'text-muted-foreground'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Category: Governance & Tools */}
              <div>
                <p className="px-2 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Governance & Review
                </p>
                <div className="space-y-1">
                  {[
                    { label: 'Audit Trail', href: '/audit', icon: 'history', desc: 'Historical telemetry logs' },
                    { label: 'Engineering Review', href: '/review', icon: 'rate_review', desc: 'Proposals approval' },
                    { label: 'Evidence Sources', href: '/evidence', icon: 'search', desc: 'Diffs & PR anchors' },
                    { label: 'Support & FAQs', href: '/support', icon: 'help', desc: 'Help & documentation' },
                  ].map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors no-underline ${
                          isActive
                            ? 'bg-foreground text-background font-bold shadow-sm'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px] flex-shrink-0"
                          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="leading-tight truncate">{item.label}</div>
                          <div className={`text-[10px] font-normal truncate ${isActive ? 'text-background/80' : 'text-muted-foreground'}`}>
                            {item.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer: User Profile & Quick Actions */}
            <div className="p-3 border-t border-border bg-muted/20 flex-shrink-0 space-y-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                    N
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground m-0">Aditya Sheregar</p>
                    <p className="text-[10px] font-mono text-muted-foreground m-0">aditya@thally.io</p>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border bg-background cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isDark ? 'light_mode' : 'dark_mode'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP NAV HEADER (Responsive Mobile + Desktop) ─────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 max-w-full">
          {/* Brand + Mobile Menu Hamburger + Desktop Tabs */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileDrawerOpen((v) => !v)}
              aria-label="Open navigation menu"
              className="md:hidden grid size-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border border-border/60 bg-transparent flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileDrawerOpen ? 'close' : 'menu'}
              </span>
            </button>

            {/* Brand Logo & Name */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-foreground no-underline hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <ThallyLogo size={26} className="sm:hidden" />
              <span>Thally</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { label: 'Workflow', href: '/dashboard' },
                { label: 'Audit', href: '/audit' },
                { label: 'Agents', href: '/agent' },
                { label: 'Docs', href: '/docs' },
              ].map((item) => {
                const isActive = item.href === '/dashboard' ? pathname.startsWith('/dashboard') : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors no-underline ${
                      isActive
                        ? 'bg-foreground/10 text-foreground font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Search Bar (Click to search resources) */}
          <div
            onClick={() => { setCmdOpen(true); setCmdQuery(''); setSelectedIndex(0); }}
            className="mx-auto hidden w-full max-w-lg items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 lg:flex cursor-pointer hover:border-foreground/30 hover:bg-muted/70 transition-all select-none"
          >
            <span
              className="material-symbols-outlined text-muted-foreground pointer-events-none text-[18px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
            <span className="w-full text-xs text-muted-foreground">
              Search resources, documentation, tools...
            </span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              ⌘K
            </kbd>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Quick Search Button on Mobile */}
            <button
              onClick={() => { setCmdOpen(true); setCmdQuery(''); setSelectedIndex(0); }}
              aria-label="Search resources"
              className="lg:hidden grid size-8 sm:size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid size-8 sm:size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setSettingsOpen(false); setWorkspaceOpen(false); setProfileOpen(false); }}
                aria-label="Notifications"
                className="grid size-8 sm:size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined text-[19px] sm:text-[20px]" style={{ fontVariationSettings: notifRead ? "'FILL' 1" : "'FILL' 0" }}>
                  {notifRead ? 'notifications' : 'notifications_unread'}
                </span>
              </button>
              {notifOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[calc(100vw-32px)] max-w-xs sm:w-80 rounded-2xl overflow-hidden z-[200] shadow-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 pb-2.5 border-b border-border flex items-center justify-between bg-muted/20">
                    <span className="font-bold text-xs text-foreground">Notifications</span>
                    <button onClick={() => setNotifRead(true)} className="text-xs text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer font-semibold hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {[
                      { dot: 'bg-emerald-500', title: 'Smart Sync completed', time: '10m ago' },
                      { dot: 'bg-red-500', title: 'New conflict detected in Schema Definition', time: '1h ago' },
                      { dot: 'bg-emerald-500', title: 'Deployment verified', time: '2h ago' },
                    ].map((n) => (
                      <div key={n.title} className="flex items-start gap-2.5 p-3.5 border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <div className={`${n.dot} ${notifRead ? 'opacity-30' : ''} w-2 h-2 rounded-full flex-shrink-0 mt-1`} />
                        <div>
                          <p className="text-xs font-semibold text-foreground m-0 leading-tight">{n.title}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings (Desktop + Tablet) */}
            <div ref={settingsRef} className="relative hidden sm:block">
              <button
                onClick={() => { setSettingsOpen((v) => !v); setNotifOpen(false); setWorkspaceOpen(false); setProfileOpen(false); }}
                aria-label="Settings"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  settings
                </span>
              </button>
              {settingsOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-80 rounded-2xl overflow-hidden z-[200] shadow-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 pb-2.5 border-b border-border bg-muted/20">
                    <span className="font-bold text-xs text-foreground">Settings</span>
                  </div>
                  {/* Account */}
                  <div className="p-3.5 border-b border-border">
                    <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground mb-2">Account</p>
                    <div className="flex flex-col gap-2">
                      {[{ label: 'Name', value: 'Aditya Sheregar' }, { label: 'Email', value: 'aditya@thally.io' }].map((f) => (
                        <div key={f.label} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{f.label}</span>
                          <span className="font-medium text-foreground">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Preferences */}
                  <div className="p-3.5 border-b border-border">
                    <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground mb-2">Preferences</p>
                    <div className="flex flex-col gap-2">
                      {[{ label: 'Dark Mode', active: isDark, toggle: toggleTheme }, { label: 'Email Alerts', active: true, toggle: () => {} }, { label: 'Sync Logs', active: true, toggle: () => {} }].map((p) => (
                        <div key={p.label} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{p.label}</span>
                          <button onClick={p.toggle} className={`w-9 h-5 rounded-full border-none cursor-pointer transition-colors relative ${p.active ? 'bg-foreground' : 'bg-muted'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background transition-all shadow-sm ${p.active ? 'left-4' : 'left-0.5'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Integrations */}
                  <div className="p-3.5">
                    <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground mb-2">Integrations</p>
                    <div className="flex flex-col gap-2">
                      {[{ name: 'GitHub', status: 'Connected', ok: true }, { name: 'GitLab', status: 'Not connected', ok: false }].map((int) => (
                        <div key={int.name} className="flex justify-between items-center text-xs">
                          <span className="font-medium text-foreground">{int.name}</span>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${int.ok ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' : 'text-muted-foreground bg-muted border-border'}`}>{int.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Workspace switcher (Desktop) */}
            <div ref={workspaceRef} className="relative hidden sm:block">
              <button
                onClick={() => { setWorkspaceOpen((v) => !v); setNotifOpen(false); setSettingsOpen(false); setProfileOpen(false); }}
                aria-label="Switch workspace"
                className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  dns
                </span>
              </button>
              {workspaceOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-64 rounded-2xl overflow-hidden z-[200] shadow-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 pb-2.5 border-b border-border bg-muted/20">
                    <span className="font-bold text-xs text-foreground">Workspaces</span>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted border border-border">
                      <span className="material-symbols-outlined text-foreground text-lg">check_circle</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground m-0">Thally — Main Control</p>
                        <p className="text-[10px] font-mono text-muted-foreground m-0">current workspace</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setWorkspaceOpen(false); toast('New workspace creation ready in team edition', 'info'); }}
                      className="flex items-center gap-2 w-full mt-1.5 p-2.5 rounded-xl border-none bg-transparent cursor-pointer text-xs text-foreground font-medium hover:bg-muted transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      + New workspace
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); setSettingsOpen(false); setWorkspaceOpen(false); }}
                className="ml-0.5 cursor-pointer hover:opacity-80 active:scale-95 transition-all bg-transparent border-none p-0"
                aria-label="Profile menu"
              >
                <div className="grid size-8 sm:size-9 place-items-center rounded-full bg-foreground text-xs font-bold text-background border border-border shadow-sm">
                  N
                </div>
              </button>
              {profileOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[calc(100vw-32px)] max-w-[240px] rounded-2xl overflow-hidden z-[200] shadow-2xl border border-border bg-card animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3.5 border-b border-border flex items-center gap-2.5 bg-muted/20">
                    <div className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-bold text-background flex-shrink-0">
                      N
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground m-0 truncate">Aditya Sheregar</p>
                      <p className="text-[10px] font-mono text-muted-foreground m-0 truncate">aditya@thally.io</p>
                    </div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: 'Documentation', icon: 'menu_book', action: () => { setProfileOpen(false); router.push('/docs'); } },
                      { label: 'Support & Help', icon: 'help', action: () => { setProfileOpen(false); router.push('/support'); } },
                      { label: 'Settings', icon: 'settings', action: () => { setProfileOpen(false); setSettingsOpen(true); } },
                      { label: 'Log out', icon: 'logout', action: () => { setProfileOpen(false); toast('Logged out successfully', 'info'); } },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`flex items-center gap-2.5 w-full p-2.5 rounded-xl border-none bg-transparent cursor-pointer text-xs font-medium text-left text-foreground hover:bg-muted transition-colors ${item.label === 'Log out' ? 'text-red-500 dark:text-red-400' : ''}`}
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0" }}>{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ── APP BODY (Desktop Sidebar + Content) ───────────────────────── */}
      <div className="flex relative z-10">

        {/* ── DESKTOP LEFT SIDEBAR (Expand on hover & Smooth Scrollable) ── */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-20 hover:w-64 transition-all duration-300 border-r border-border bg-background/85 backdrop-blur-md group overflow-x-hidden overflow-y-auto no-scrollbar sticky top-16 h-[calc(100vh-4rem)] z-40 select-none">
          {/* Brand header */}
          <div className="px-5 py-4 flex items-center gap-3.5 whitespace-nowrap border-b border-border flex-shrink-0">
            <ThallyLogo size={32} />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="font-bold text-foreground text-sm leading-tight">
                Thally
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                v2.4.0
              </div>
            </div>
          </div>

          {/* Main Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overscroll-contain no-scrollbar">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname.startsWith('/dashboard')
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline cursor-pointer ${
                    isActive
                      ? 'bg-foreground/10 text-foreground font-bold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-0.5'
                  }`}
                >
                  <span
                    className="material-symbols-outlined flex-shrink-0 text-[20px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Nav Items */}
          <div className="px-3 py-4 border-t border-border space-y-1 overflow-hidden flex-shrink-0">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline cursor-pointer ${
                    isActive
                      ? 'bg-foreground/10 text-foreground font-bold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-0.5'
                  }`}
                >
                  <span
                    className="material-symbols-outlined flex-shrink-0 text-[20px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
            <div className="pt-2 flex items-center gap-3 px-2">
              <div className="grid size-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background flex-shrink-0">
                N
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <p className="text-xs font-bold text-foreground m-0">Aditya</p>
                <p className="text-[10px] font-mono text-muted-foreground m-0">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT CONTAINER ─────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-x-hidden pb-20 md:pb-6">
          {children}
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (Fixed Dock) ────────────────── */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border px-3 py-2 flex items-center justify-around pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      >
        {[
          { label: 'Workflow', href: '/dashboard', icon: 'dashboard' },
          { label: 'Impact', href: '/impact', icon: 'radar' },
          { label: 'Agent', href: '/agent', icon: 'smart_toy' },
          { label: 'Docs', href: '/docs', icon: 'menu_book' },
        ].map((tab) => {
          const isActive = tab.href === '/dashboard' ? pathname.startsWith('/dashboard') : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all no-underline ${
                isActive
                  ? 'text-foreground font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-foreground/10' : ''}`}>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
              </div>
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}

        {/* More / Menu Drawer Trigger */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-muted-foreground hover:text-foreground transition-all border-none bg-transparent cursor-pointer"
        >
          <div className="p-1 rounded-lg">
            <span className="material-symbols-outlined text-[20px]">
              menu
            </span>
          </div>
          <span className="text-[10px] font-medium leading-none">Menu</span>
        </button>
      </nav>
    </div>
  );
}
