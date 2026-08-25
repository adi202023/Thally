'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  GitCommit,
  FileSearch,
  FileText,
  Eye,
  BookOpen,
  Bot,
  History,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Overview & system status',
      icon: <LayoutDashboard size={16} />,
      href: '/',
    },
    {
      id: 'change',
      title: 'Smart Sync Product Change',
      subtitle: 'feat(sync): introduce Smart Sync',
      icon: <GitCommit size={16} />,
      href: '/changes/change-smartsync-001',
    },
    {
      id: 'analysis',
      title: 'Knowledge Impact Report',
      subtitle: 'Engineering impact analysis & risk breakdown',
      icon: <Sparkles size={16} />,
      href: '/changes/change-smartsync-001/report',
    },
    {
      id: 'evidence',
      title: 'Source Evidence Explorer',
      subtitle: '14 traceable code snippets, AST diffs, and tests',
      icon: <FileSearch size={16} />,
      href: '/changes/change-smartsync-001/evidence',
    },
    {
      id: 'review',
      title: 'Documentation Proposal Review',
      subtitle: 'Human-in-the-loop review & diff editor',
      icon: <FileText size={16} />,
      href: '/review/proposal-smartsync-001',
    },
    {
      id: 'preview',
      title: 'Deployment Preview',
      subtitle: '7-point validation check & merge gate',
      icon: <Eye size={16} />,
      href: '/preview/preview-smartsync-001',
    },
    {
      id: 'docs',
      title: 'Documentation Site',
      subtitle: 'Live public documentation portal',
      icon: <BookOpen size={16} />,
      href: '/docs',
    },
    {
      id: 'agent',
      title: 'Agent Knowledge Query',
      subtitle: 'Ask agent & inspect citation sources',
      icon: <Bot size={16} />,
      href: '/agent',
    },
    {
      id: 'audit',
      title: 'Audit Log Timeline',
      subtitle: 'Full audit history of all 13 synchronization events',
      icon: <History size={16} />,
      href: '/audit',
    },
    {
      id: 'verification',
      title: 'Final Verification Report',
      subtitle: 'What Thally understood, missed, and verified',
      icon: <CheckCircle2 size={16} />,
      href: '/verification',
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          router.push(selected.href);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div
        id="command-palette-modal"
        data-testid="command-palette-modal"
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="command-palette-search">
          <Search size={18} className="text-tertiary" />
          <input
            id="command-palette-input"
            data-testid="command-palette-input"
            autoFocus
            type="text"
            placeholder="Type a command or search workflow..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="command-palette-key">ESC</span>
        </div>

        <div className="command-palette-results">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-tertiary text-sm">No actions found.</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={item.id}
                className={`command-palette-item ${idx === selectedIndex ? 'focused' : ''}`}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="command-palette-item-icon">{item.icon}</div>
                <div>
                  <div className="command-palette-item-title">{item.title}</div>
                  <div className="command-palette-item-subtitle">{item.subtitle}</div>
                </div>
                <div className="command-palette-shortcut">
                  <span className="command-palette-key">↵</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
