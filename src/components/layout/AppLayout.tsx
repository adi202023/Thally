'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

// Command palette
const COMMANDS = [
  { label: 'Dashboard', href: '/', icon: 'dashboard' },
  { label: 'Impact Radar', href: '/impact', icon: 'radar' },
  { label: 'Deployments', href: '/preview', icon: 'rocket_launch' },
  { label: 'Infrastructure', href: '/changes', icon: 'developer_board' },
  { label: 'Security', href: '/verification', icon: 'shield_with_heart' },
  { label: 'Docs', href: '/docs', icon: 'menu_book' },
  { label: 'Agent Knowledge', href: '/agent', icon: 'smart_toy' },
  { label: 'Audit Trail', href: '/audit', icon: 'history' },
  { label: 'Review', href: '/review', icon: 'rate_review' },
  { label: 'Evidence', href: '/evidence', icon: 'search' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toasts, toast } = useToast();

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
    { label: 'Support', href: '/agent', icon: 'help' },
  ];

  const filteredCmds = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(cmdQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background dark:bg-inverse-surface text-text-primary dark:text-inverse-on-surface font-body-md antialiased transition-colors duration-300">
      {/* Background Grid */}
      <div className="fixed inset-0 w-full h-full grid-bg -z-10 pointer-events-none transition-colors duration-300" />

      {/* ── TOAST NOTIFICATIONS ─────────────────────────────────────── */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border pointer-events-auto transition-all duration-300 ${
              t.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
                : t.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
                : 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim border-primary/20'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── COMMAND PALETTE ─────────────────────────────────────────── */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center pt-24 px-4"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-lg glass-card rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle dark:border-white/10">
              <span
                className="material-symbols-outlined text-outline dark:text-outline-variant"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                search
              </span>
              <input
                autoFocus
                className="flex-1 bg-transparent outline-none text-body-sm text-text-primary dark:text-inverse-on-surface placeholder:text-text-secondary dark:placeholder:text-outline-variant"
                placeholder="Search pages, actions..."
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredCmds[0]) {
                    router.push(filteredCmds[0].href);
                    setCmdOpen(false);
                  }
                }}
              />
              <kbd className="font-mono-data text-[10px] text-text-secondary dark:text-outline-variant bg-surface-variant dark:bg-white/10 px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>
            <ul className="max-h-72 overflow-auto">
              {filteredCmds.length === 0 ? (
                <li className="px-4 py-6 text-center text-text-secondary dark:text-outline-variant text-sm">
                  No results found
                </li>
              ) : (
                filteredCmds.map((cmd) => (
                  <li key={cmd.href}>
                    <Link
                      href={cmd.href}
                      onClick={() => setCmdOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors cursor-pointer no-underline text-text-primary dark:text-inverse-on-surface"
                    >
                      <span
                        className="material-symbols-outlined text-primary dark:text-primary-fixed-dim"
                        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 0" }}
                      >
                        {cmd.icon}
                      </span>
                      <span className="text-body-sm font-medium">{cmd.label}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ── TOP NAV ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 w-full backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm flex justify-between items-center px-4 md:px-margin-page h-16 z-50 bg-glass-surface dark:bg-inverse-surface/70 transition-colors duration-300">
        {/* Logo + Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display-hero text-headline-lg-mobile tracking-tighter text-primary dark:text-primary-fixed-dim no-underline hover:opacity-80 transition-opacity"
          >
            Thally
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Workflow', href: '/' },
              { label: 'Audit', href: '/audit' },
              { label: 'Agents', href: '/agent' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-body-sm font-medium transition-colors px-3 py-1.5 rounded-lg no-underline ${
                  pathname === item.href
                    ? 'text-primary dark:text-primary-fixed-dim bg-primary/10 dark:bg-primary/10'
                    : 'text-text-secondary dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-low dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant pointer-events-none select-none"
            style={{ fontVariationSettings: "'FILL' 0", fontSize: '18px' }}
          >
            search
          </span>
          <input
            className="w-full bg-surface-container-low/50 dark:bg-black/20 backdrop-blur-sm border border-border-subtle dark:border-white/10 rounded-full py-2 pl-10 pr-12 text-body-sm font-body-sm focus:outline-none focus:border-primary dark:focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary dark:focus:ring-primary-fixed-dim transition-colors dark:text-inverse-on-surface"
            placeholder="Search resources..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                toast(`Searching for "${searchQuery}"...`, 'info');
              }
            }}
          />
          <button
            onClick={() => { setCmdOpen(true); setCmdQuery(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-data text-text-secondary dark:text-outline-variant bg-surface-variant dark:bg-white/10 px-2 py-0.5 rounded text-[10px] cursor-pointer hover:bg-primary/10 dark:hover:bg-white/20 transition-colors"
          >
            ⌘K
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant cursor-pointer active:scale-95 transition-all hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full hover:text-primary"
            style={{ fontVariationSettings: "'FILL' 0" }}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {isDark ? 'light_mode' : 'dark_mode'}
          </button>
          <button
            onClick={() => toast('No new notifications', 'info')}
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant cursor-pointer active:scale-95 transition-all hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full hover:text-primary"
            style={{ fontVariationSettings: "'FILL' 0" }}
            title="Notifications"
            aria-label="Notifications"
          >
            notifications
          </button>
          <button
            onClick={() => toast('Settings coming soon', 'info')}
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant cursor-pointer active:scale-95 transition-all hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full hover:text-primary"
            style={{ fontVariationSettings: "'FILL' 0" }}
            title="Settings"
            aria-label="Settings"
          >
            settings
          </button>
          <button
            onClick={() => toast('Infrastructure panel coming soon', 'info')}
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant cursor-pointer active:scale-95 transition-all hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full hover:text-primary"
            style={{ fontVariationSettings: "'FILL' 0" }}
            title="DNS"
            aria-label="DNS"
          >
            dns
          </button>
          <button
            onClick={() => toast('Profile coming soon', 'info')}
            className="ml-1 cursor-pointer hover:opacity-80 active:scale-95 transition-all"
            aria-label="Profile"
          >
            <img
              className="w-8 h-8 rounded-full border border-border-subtle dark:border-white/10 object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkcj3GDWtVU0nSrrv_cNjlSR7iz5Kg1zuePzrJ6aenUytdJK33QFEspXmAXgcm24thNagHo4eppNrrEkWXZi-LqFP4mNG7zHGpk_R25xHklVd8UOKNPUKBeX-4XuuwoSfrxKqMhNFD0wW8ccLeckHj4TLFUG2U0nwR0CkwgANJSavcVotmTuaCy76hYLasfxxOUjMBTJtea_uzlYwioFwuurLQWYHqhs3GjPlPQFNL6m0MoYOkyETC"
            />
          </button>
        </div>
      </nav>

      {/* ── APP BODY (Sidebar + Content) ────────────────────────────── */}
      <div className="flex">

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col flex-shrink-0 w-20 hover:w-64 transition-all duration-300 border-r border-outline-variant dark:border-white/10 bg-surface dark:bg-inverse-surface group overflow-hidden sticky top-16 h-[calc(100vh-4rem)] z-40">
          {/* Brand */}
          <div className="px-6 py-6 flex items-center gap-4 whitespace-nowrap border-b border-border-subtle dark:border-white/10">
            <img
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              alt="Thally"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnWytsusN8LZiBIRkBlsC2UOjinbzS4nO5YxuY8o0jQ2Bgi-jkHHaXUE_2rF767rbbfZc3YtPbMCnDhgFV6lbg0DWjHUv-zBgH2Jv1A5ZjbOMAHmr0txCVsJvK_fTi1-Q_Nh_AQqOvKg7sei0ApxGY0LWuTvI7OXvTgzdw0EaCk7HZNFw6zXKmcXoi4qvWQFAzrNtRIbh1jHnzobLEGqOra9B7gWHQwtynYR5Wc3QLoVHZX3jdc1O-"
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="font-bold text-text-primary dark:text-inverse-on-surface text-sm">
                Thally
              </div>
              <div className="text-[10px] text-text-secondary dark:text-outline-variant font-mono">
                v2.4.0
              </div>
            </div>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-200 no-underline cursor-pointer ${
                    isActive
                      ? 'text-primary dark:text-primary-fixed-dim bg-primary/10 dark:bg-primary-fixed-dim/10 font-bold'
                      : 'text-outline dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-low dark:hover:bg-white/5 hover:translate-x-0.5'
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
          <div className="px-3 py-4 border-t border-border-subtle dark:border-white/10 space-y-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-all duration-200 no-underline cursor-pointer ${
                    isActive
                      ? 'text-primary dark:text-primary-fixed-dim bg-primary/10 dark:bg-primary-fixed-dim/10 font-bold'
                      : 'text-outline dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim hover:bg-surface-container-low dark:hover:bg-white/5 hover:translate-x-0.5'
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
            <button
              onClick={() => toast('New project coming soon', 'info')}
              className="w-full mt-3 bg-gradient-to-r from-primary to-accent-indigo text-white rounded-lg py-2 px-2 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:opacity-90 active:scale-95"
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                add
              </span>
              <span className="text-[12px] font-bold tracking-widest whitespace-nowrap uppercase">
                New Project
              </span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
        {/* flex-1 ensures content always takes all space beside the sidebar */}
        <div className="flex-1 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
