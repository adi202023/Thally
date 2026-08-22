'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitCommit,
  Sparkles,
  FileSearch,
  FileText,
  Eye,
  BookOpen,
  Bot,
  History,
  CheckCircle2,
  Search,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { CommandPalette } from '@/components/design-system/CommandPalette';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  external?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If on /docs path, we render docs layout independently
  const isDocs = pathname?.startsWith('/docs');

  if (isDocs) {
    return <>{children}</>;
  }

  const navItems: NavGroup[] = [
    {
      label: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={16} /> },
        { label: 'Product Changes', href: '/changes/change-smartsync-001', icon: <GitCommit size={16} />, badge: '1 active' },
      ],
    },
    {
      label: 'KNOWLEDGE PIPELINE',
      items: [
        { label: 'Impact Analysis', href: '/changes/change-smartsync-001/report', icon: <Sparkles size={16} /> },
        { label: 'Source Evidence', href: '/changes/change-smartsync-001/evidence', icon: <FileSearch size={16} />, badge: '14' },
        { label: 'Proposal Review', href: '/review/proposal-smartsync-001', icon: <FileText size={16} />, badge: 'Needs Review' },
        { label: 'Deployment Preview', href: '/preview/preview-smartsync-001', icon: <Eye size={16} /> },
      ],
    },
    {
      label: 'PUBLICATION & AGENT',
      items: [
        { label: 'Documentation Site', href: '/docs', icon: <BookOpen size={16} />, external: false },
        { label: 'Agent Knowledge', href: '/agent', icon: <Bot size={16} /> },
        { label: 'Audit Trail', href: '/audit', icon: <History size={16} /> },
        { label: 'Final Verification', href: '/verification', icon: <CheckCircle2 size={16} /> },
      ],
    },
  ];

  return (
    <div className="app-shell">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="drawer-overlay lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link href="/" className="sidebar-logo">
          <div className="sidebar-logo-mark">T</div>
          <div>
            <div className="sidebar-logo-text">Thally</div>
            <div className="sidebar-logo-tag">Product Knowledge Engine</div>
          </div>
        </Link>

        {/* Demo Mode Badge */}
        <div className="sidebar-mode-badge" title="Running in safe Demo Mode. Set DEMO_MODE=false to connect real repositories and AI.">
          <span className="dot" />
          <span>Demo Knowledge Analysis</span>
        </div>

        {/* Search / Command trigger */}
        <div className="px-4 py-2">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-secondary bg-surface-2 border border-default rounded hover:border-brand transition-all"
          >
            <div className="flex items-center gap-2">
              <Search size={13} className="text-tertiary" />
              <span>Search or command...</span>
            </div>
            <span className="command-palette-key">⌘K</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="mb-2">
              <div className="sidebar-section-label">{group.label}</div>
              {group.items.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="sidebar-nav-badge">{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-avatar">AC</div>
          <div className="min-w-0 flex-1">
            <div className="sidebar-user-name">Alex Chen</div>
            <div className="sidebar-user-role">Maintainer • Demo Org</div>
          </div>
          <span title="project:write scope active">
            <ShieldCheck size={14} className="text-success" />
          </span>
        </div>
      </aside>

      {/* Main Container */}
      <div className="app-main">
        {/* Mobile Header Bar */}
        <div className="lg:hidden p-4 bg-surface-0 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-icon btn-ghost"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-bold text-md">Thally</span>
          </div>
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="btn-icon btn-secondary btn-xs"
            aria-label="Search"
          >
            <Search size={14} />
          </button>
        </div>

        {children}
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
