'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Check initial theme preference
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.theme = 'light';
    }
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

  return (
    <div className="min-h-screen relative overflow-x-hidden antialiased">
      {/* Background Shader & Grid */}
      <div className="fixed inset-0 w-full h-full grid-bg -z-10 pointer-events-none transition-colors duration-300" />

      {/* TopNavBar Shared Component */}
      <nav className="sticky top-0 w-full backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm flex justify-between items-center px-margin-page h-16 z-50 bg-glass-surface dark:bg-inverse-surface/70 transition-colors duration-300">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-display-hero text-headline-lg-mobile tracking-tighter text-primary dark:text-primary-fixed-dim no-underline"
          >
            Thally
          </Link>

          <div className="hidden lg:flex items-center gap-6 mr-8">
            <Link
              href="/"
              className={`text-body-sm font-medium transition-colors no-underline ${
                pathname === '/'
                  ? 'text-primary dark:text-primary-fixed-dim font-bold'
                  : 'text-text-secondary dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`}
            >
              Workflow
            </Link>
            <Link
              href="/audit"
              className={`text-body-sm font-medium transition-colors no-underline ${
                pathname === '/audit'
                  ? 'text-primary dark:text-primary-fixed-dim font-bold'
                  : 'text-text-secondary dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`}
            >
              Audit
            </Link>
            <Link
              href="/agent"
              className={`text-body-sm font-medium transition-colors no-underline ${
                pathname === '/agent'
                  ? 'text-primary dark:text-primary-fixed-dim font-bold'
                  : 'text-text-secondary dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim'
              }`}
            >
              Agents
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline dark:text-outline-variant select-none pointer-events-none"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            search
          </span>
          <input
            className="w-full bg-surface-container-low/50 dark:bg-black/20 backdrop-blur-sm border border-border-subtle dark:border-white/10 rounded-full py-2 pl-10 pr-12 text-body-sm font-body-sm focus:outline-none focus:border-primary dark:focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary dark:focus:ring-primary-fixed-dim transition-colors dark:text-inverse-on-surface"
            placeholder="Search resources..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono-data text-mono-data text-text-secondary dark:text-outline-variant bg-surface-variant dark:bg-white/10 px-2 py-0.5 rounded text-[10px]">
            ⌘K
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant font-medium cursor-pointer active:scale-95 transition-transform hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full hover:text-primary"
            id="theme-toggle"
            style={{ fontVariationSettings: "'FILL' 0" }}
            aria-label="Toggle Theme"
          >
            {isDark ? 'light_mode' : 'dark_mode'}
          </button>
          <span
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant font-medium cursor-pointer active:scale-95 transition-transform hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            notifications
          </span>
          <span
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant font-medium cursor-pointer active:scale-95 transition-transform hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            settings
          </span>
          <span
            className="material-symbols-outlined text-on-surface-variant dark:text-outline-variant font-medium cursor-pointer active:scale-95 transition-transform hover:bg-surface-container-low dark:hover:bg-white/10 p-2 rounded-full"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            dns
          </span>
          <img
            className="w-8 h-8 rounded-full border border-border-subtle dark:border-white/10 object-cover ml-2 cursor-pointer hover:scale-110 transition-transform"
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkcj3GDWtVU0nSrrv_cNjlSR7iz5Kg1zuePzrJ6aenUytdJK33QFEspXmAXgcm24thNagHo4eppNrrEkWXZi-LqFP4mNG7zHGpk_R25xHklVd8UOKNPUKBeX-4XuuwoSfrxKqMhNFD0wW8ccLeckHj4TLFUG2U0nwR0CkwgANJSavcVotmTuaCy76hYLasfxxOUjMBTJtea_uzlYwioFwuurLQWYHqhs3GjPlPQFNL6m0MoYOkyETC"
          />
        </div>
      </nav>

      {/* SideNavBar Shared Component (Desktop only) */}
      <aside className="hidden md:flex flex-col py-margin-page z-40 fixed left-0 h-full w-20 hover:w-64 transition-all duration-300 border-r border-outline-variant dark:border-white/10 bg-surface dark:bg-inverse-surface group overflow-hidden">
        <div className="px-6 mb-8 flex items-center gap-4 whitespace-nowrap">
          <img
            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            alt="Thally Instance"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnWytsusN8LZiBIRkBlsC2UOjinbzS4nO5YxuY8o0jQ2Bgi-jkHHaXUE_2rF767rbbfZc3YtPbMCnDhgFV6lbg0DWjHUv-zBgH2Jv1A5ZjbOMAHmr0txCVsJvK_fTi1-Q_Nh_AQqOvKg7sei0ApxGY0LWuTvI7OXvTgzdw0EaCk7HZNFw6zXKmcXoi4qvWQFAzrNtRIbh1jHnzobLEGqOra9B7gWHQwtynYR5Wc3QLoVHZX3jdc1O-"
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="font-bold text-text-primary dark:text-inverse-on-surface">
              Thally
            </div>
            <div className="font-mono-data text-[10px] text-text-secondary dark:text-outline-variant">
              v2.4.0
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-2 py-2 rounded-lg font-bold hover:translate-x-1 transition-all duration-200 no-underline ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed-dim bg-primary/10 dark:bg-primary-fixed-dim/10'
                    : 'text-outline dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim'
                }`}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="px-4 pb-16 space-y-2 border-t border-border-subtle dark:border-white/10 pt-4 mt-auto">
          {bottomNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-2 py-2 rounded-lg hover:translate-x-1 transition-all duration-200 no-underline ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed-dim font-bold'
                    : 'text-outline dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed-dim'
                }`}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button className="w-full mt-4 bg-gradient-to-r from-primary to-accent-indigo text-white rounded-lg py-2 px-2 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              add
            </span>
            <span className="font-label-caps text-label-caps whitespace-nowrap">
              New Project
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      {children}
    </div>
  );
}
