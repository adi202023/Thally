'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatedBackground } from '@/components/AnimatedBackground';

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
  { label: 'Dashboard', category: 'Pages', desc: 'Main control plane, synthesis pipeline, and metrics', href: '/', icon: 'dashboard' },
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

  // Dropdown state
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

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
        setCmdQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') setCmdOpen(false);
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
    toast(next ? 'Dark mode enabled' : 'Light mode enabled', 'info');
  };

  const navItems = [
    { label: 'Dashboard', href: '/', icon: 'dashboard' },
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

  return (
    <div className="min-h-screen bg-background text-foreground font-body-md antialiased transition-colors duration-300 relative">
      {/* Animated Knowledge Graph Background */}
      <AnimatedBackground theme={isDark ? 'dark' : 'light'} />

      {/* ── TOAST NOTIFICATIONS ─────────────────────────────────────── */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
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
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
              <span
                className="material-symbols-outlined text-muted-foreground text-[22px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                search
              </span>
              <input
                ref={searchInputRef}
                autoFocus
                className="flex-1 bg-transparent outline-none text-base text-foreground placeholder:text-muted-foreground font-sans"
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
              <kbd className="font-mono text-[10px] text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2">
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
                        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-foreground/10 text-foreground'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`grid size-9 place-items-center rounded-lg border border-border flex-shrink-0 ${
                            isSelected ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                          }`}>
                            <span
                              className="material-symbols-outlined text-[20px]"
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

                        <span className="flex-shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border border-border bg-muted/60 text-muted-foreground">
                          {item.category}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-5 py-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground font-mono">
              <span>{filteredResources.length} resources available</span>
              <div className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP NAV ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
          {/* Brand + tabs */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground no-underline hover:opacity-80 transition-opacity"
            >
              Thally
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {[
                { label: 'Workflow', href: '/' },
                { label: 'Audit', href: '/audit' },
                { label: 'Agents', href: '/agent' },
              ].map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors no-underline ${
                      isActive
                        ? 'bg-foreground/10 text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search Bar (Click to search resources) */}
          <div
            onClick={() => { setCmdOpen(true); setCmdQuery(''); setSelectedIndex(0); }}
            className="mx-auto hidden w-full max-w-xl items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 sm:flex cursor-pointer hover:border-foreground/30 hover:bg-muted/70 transition-all select-none"
          >
            <span
              className="material-symbols-outlined text-muted-foreground pointer-events-none text-[18px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              search
            </span>
            <span className="w-full text-sm text-muted-foreground">
              Search resources...
            </span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              ⌘K
            </kbd>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setSettingsOpen(false); setWorkspaceOpen(false); setProfileOpen(false); }}
                aria-label="Notifications"
                className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: notifRead ? "'FILL' 1" : "'FILL' 0" }}>
                  {notifRead ? 'notifications' : 'notifications_unread'}
                </span>
              </button>
              {notifOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 w-80 rounded-xl overflow-hidden z-[200] shadow-2xl border border-border bg-card">
                  <div className="p-3.5 pb-2.5 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">Notifications</span>
                    <button onClick={() => setNotifRead(true)} className="text-xs text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer font-semibold hover:underline">Mark all as read</button>
                  </div>
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
              )}
            </div>

            {/* Settings */}
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => { setSettingsOpen((v) => !v); setNotifOpen(false); setWorkspaceOpen(false); setProfileOpen(false); }}
                aria-label="Settings"
                className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  settings
                </span>
              </button>
              {settingsOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 w-80 rounded-xl overflow-hidden z-[200] shadow-2xl border border-border bg-card">
                  <div className="p-3.5 pb-2.5 border-b border-border">
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
                      {[{ label: 'Dark Mode', active: isDark, toggle: toggleTheme }, { label: 'Email Notifications', active: true, toggle: () => {} }, { label: 'Sync Alerts', active: false, toggle: () => {} }].map((p) => (
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

            {/* Workspace switcher */}
            <div ref={workspaceRef} className="relative">
              <button
                onClick={() => { setWorkspaceOpen((v) => !v); setNotifOpen(false); setSettingsOpen(false); setProfileOpen(false); }}
                aria-label="Switch workspace"
                className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                  dns
                </span>
              </button>
              {workspaceOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 w-64 rounded-xl overflow-hidden z-[200] shadow-2xl border border-border bg-card">
                  <div className="p-3.5 pb-2.5 border-b border-border">
                    <span className="font-bold text-xs text-foreground">Workspaces</span>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted border border-border">
                      <span className="material-symbols-outlined text-foreground text-lg">check_circle</span>
                      <div>
                        <p className="text-xs font-semibold text-foreground m-0">Thally — Main Control</p>
                        <p className="text-[10px] font-mono text-muted-foreground m-0">current</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setWorkspaceOpen(false); toast('New workspace coming soon', 'info'); }}
                      className="flex items-center gap-2 w-full mt-1.5 p-2.5 rounded-lg border-none bg-transparent cursor-pointer text-xs text-foreground font-medium hover:bg-muted transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      + New workspace
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile avatar */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); setSettingsOpen(false); setWorkspaceOpen(false); }}
                className="ml-1 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
                aria-label="Profile"
              >
                <div className="grid size-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background border border-border">
                  N
                </div>
              </button>
              {profileOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 w-56 rounded-xl overflow-hidden z-[200] shadow-2xl border border-border bg-card">
                  <div className="p-3.5 border-b border-border flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                      N
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground m-0">Aditya Sheregar</p>
                      <p className="text-[10px] font-mono text-muted-foreground m-0">aditya@thally.io</p>
                    </div>
                  </div>
                  <div className="p-1.5">
                    {[
                      { label: 'Settings', icon: 'settings', action: () => { setProfileOpen(false); setSettingsOpen(true); } },
                      { label: 'Support', icon: 'help', action: () => { setProfileOpen(false); router.push('/support'); } },
                      { label: 'Log out', icon: 'logout', action: () => { setProfileOpen(false); toast('Logged out', 'info'); } },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`flex items-center gap-2.5 w-full p-2 rounded-lg border-none bg-transparent cursor-pointer text-xs font-medium text-left text-foreground hover:bg-muted transition-colors ${item.label === 'Log out' ? 'text-red-500 dark:text-red-400' : ''}`}
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

      {/* ── APP BODY (Sidebar + Content) ────────────────────────────── */}
      <div className="flex relative z-10">

        {/* ── LEFT SIDEBAR (Expand on hover) ──────────────────────── */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-20 hover:w-64 transition-all duration-300 border-r border-border bg-background/80 backdrop-blur-md group overflow-x-hidden overflow-y-hidden no-scrollbar sticky top-16 h-[calc(100vh-4rem)] z-40 select-none">
          {/* Brand header */}
          <div className="px-5 py-5 flex items-center gap-3.5 whitespace-nowrap border-b border-border">
            <div className="grid size-9 place-items-center rounded-xl border border-border bg-card text-xs font-bold text-foreground flex-shrink-0">
              T
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="font-bold text-foreground text-sm leading-tight">
                Thally
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                v2.4.0
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 no-underline cursor-pointer ${
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

          {/* Bottom Nav */}
          <div className="px-3 py-4 border-t border-border space-y-1 overflow-hidden">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 no-underline cursor-pointer ${
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

        {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
