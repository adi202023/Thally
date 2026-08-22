'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Search,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Layers,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Badge } from '@/components/design-system/Badge';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    {
      title: 'OVERVIEW & QUICKSTART',
      links: [
        { title: 'Getting Started', slug: 'getting-started' },
        { title: 'Smart Sync', slug: 'smart-sync', isNew: true },
      ],
    },
    {
      title: 'CONFIGURATION',
      links: [
        { title: 'Project Settings', slug: 'project-settings' },
        { title: 'Permissions', slug: 'permissions' },
      ],
    },
    {
      title: 'DEVELOPER REFERENCE',
      links: [
        { title: 'API Reference', slug: 'api-reference' },
        { title: 'Troubleshooting', slug: 'troubleshooting' },
      ],
    },
    {
      title: 'COMMUNITY & RELEASES',
      links: [
        { title: 'FAQ', slug: 'faq' },
        { title: 'Changelog', slug: 'changelog', isNew: true },
      ],
    },
  ];

  const filteredSections = sections.map((sec) => ({
    ...sec,
    links: sec.links.filter(
      (l) =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.slug.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((sec) => sec.links.length > 0);

  return (
    <div className="docs-layout">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="drawer-overlay lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Docs Sidebar */}
      <aside className={`docs-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <Link href="/docs" className="flex items-center gap-2 no-underline">
            <div className="docs-sidebar-logo-mark">T</div>
            <span className="docs-sidebar-logo-text">Thally Docs</span>
          </Link>
          <Badge variant="brand">v1.1.0</Badge>
        </div>

        {/* Back to Control Plane */}
        <div className="px-4 pt-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition-colors p-2 rounded bg-surface-2 border border-subtle"
          >
            <ArrowLeft size={12} />
            <span>Back to Thally Control Plane</span>
          </Link>
        </div>

        {/* Search */}
        <div className="docs-sidebar-search">
          <Search size={14} className="docs-sidebar-search-icon" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Navigation */}
        <nav className="docs-sidebar-nav">
          {filteredSections.map((sec, i) => (
            <div key={i} className="mb-4">
              <div className="docs-sidebar-section">{sec.title}</div>
              <div className="flex flex-col gap-1">
                {sec.links.map((link) => {
                  const href = `/docs/${link.slug}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={link.slug}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`docs-sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <span>{link.title}</span>
                      {link.isNew && <span className="new-badge">v1.1</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Docs Area */}
      <div className="docs-main">
        {/* Mobile Header */}
        <div className="lg:hidden w-full p-4 bg-surface-0 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn-icon btn-ghost"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-bold text-sm">Thally Docs</span>
          </div>
          <Link href="/" className="text-xs text-brand font-medium">
            Control Plane →
          </Link>
        </div>

        {children}
      </div>
    </div>
  );
}
