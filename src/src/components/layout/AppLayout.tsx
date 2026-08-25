'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitCommit,
  Sparkles,
  FileSearch,
  FileCheck2,
  Cloud,
  BookOpen,
  Bot,
  History,
  ShieldCheck,
  Search,
  Command,
  ChevronRight,
  Menu,
  X,
  Zap,
} from 'lucide-react';

const nav = [
  ['Command Center', '/', LayoutDashboard],
  ['Product Changes', '/changes', GitCommit, '01'],
  ['Impact Analysis', '/impact', Sparkles],
  ['Source Evidence', '/evidence', FileSearch, '14'],
  ['Proposal Review', '/review', FileCheck2, '1'],
  ['Deployment Preview', '/preview', Cloud],
  ['Documentation', '/docs', BookOpen],
  ['Agent Knowledge', '/agent', Bot],
  ['Audit Trail', '/audit', History],
  ['Verification', '/verification', ShieldCheck],
] as const;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPalette(false);
      }

      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k'
      ) {
        event.preventDefault();
        setPalette(true);
      }
    };

    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('keydown', key);
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-pink" />

      {open && (
        <button
          className="mobile-scrim"
          data-testid="mobile-menu-scrim"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`sidebar ${open ? 'is-open' : ''}`}
        data-testid="app-sidebar"
      >
        <Link
          href="/"
          className="brand"
          data-testid="brand-home-link"
        >
          <span className="brand-mark">
            <Zap size={19} />
          </span>

          <span>
            <b>THALLY</b>
            <small>product knowledge engine</small>
          </span>
        </Link>

        <div
          className="system-chip"
          data-testid="system-status-chip"
        >
          <span className="pulse-dot" />
          SYSTEM ONLINE
          <span className="chip-version">v1.1.0</span>
        </div>

        <button
          className="search-trigger"
          data-testid="command-palette-trigger"
          onClick={() => setPalette(true)}
        >
          <Search size={15} />
          Search command center
          <kbd>⌘ K</kbd>
        </button>

        <nav
          className="side-nav"
          aria-label="Main navigation"
        >
          {nav.map(([label, to, Icon, badge]) => {
            const isActive =
              to === '/' ? pathname === '/' : pathname.startsWith(to);

            return (
              <Link
                key={to}
                href={to}
                onClick={() => setOpen(false)}
                className={`nav-item ${isActive ? 'active' : ''}`}
                data-testid={`nav-${label
                  .toLowerCase()
                  .replaceAll(' ', '-')}`}
              >
                <Icon size={16} />
                <span>{label}</span>
                {badge && <em>{badge}</em>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">AC</div>

          <div>
            <b>Alex Chen</b>
            <small>Maintainer · Demo Org</small>
          </div>

          <ShieldCheck
            size={16}
            className="success"
          />
        </div>
      </aside>

      <main className="main-area">
        <header className="mobile-header">
          <button
            data-testid="mobile-menu-button"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>

          <b>THALLY</b>

          <button
            data-testid="mobile-search-button"
            onClick={() => setPalette(true)}
          >
            <Search />
          </button>
        </header>

        {children}
      </main>

      {palette && (
        <div
          className="palette-backdrop"
          data-testid="command-palette-modal"
          onClick={() => setPalette(false)}
        >
          <div
            className="command-palette"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="palette-input">
              <Command size={17} />

              <input
                autoFocus
                placeholder="Jump to a workspace..."
                data-testid="command-palette-input"
              />

              <kbd>ESC</kbd>
            </div>

            {nav.slice(0, 6).map(([label, to, Icon]) => (
              <Link
                key={to}
                href={to}
                onClick={() => setPalette(false)}
                className="palette-item"
                data-testid={`palette-${label
                  .toLowerCase()
                  .replaceAll(' ', '-')}`}
              >
                <Icon size={16} />
                <span>{label}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
