'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Code2,
  HelpCircle,
  History,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardBody } from '@/components/design-system/Card';
import { Badge } from '@/components/design-system/Badge';

export default function DocsHomePage() {
  const docCards = [
    {
      title: 'Getting Started',
      slug: 'getting-started',
      desc: 'Quickstart guide to connecting your repository and configuring knowledge areas.',
      icon: <BookOpen size={20} className="text-brand" />,
      badge: 'Quickstart',
    },
    {
      title: 'Smart Sync',
      slug: 'smart-sync',
      desc: 'Automated documentation synchronization based on selected repository sources and frequencies.',
      icon: <Sparkles size={20} className="text-purple-600" />,
      badge: 'New in v1.1.0',
    },
    {
      title: 'Project Settings',
      slug: 'project-settings',
      desc: 'Configure repository webhooks, analysis sensitivity, and team assignments.',
      icon: <Sliders size={20} className="text-secondary" />,
    },
    {
      title: 'Permissions',
      slug: 'permissions',
      desc: 'Role-based access control and scope requirements (including project:write).',
      icon: <Shield size={20} className="text-error" />,
    },
    {
      title: 'API Reference',
      slug: 'api-reference',
      desc: 'REST API documentation, JWT authentication, endpoints, and rate limits.',
      icon: <Code2 size={20} className="text-success" />,
    },
    {
      title: 'Changelog',
      slug: 'changelog',
      desc: 'Release notes and history, including Smart Sync v1.1.0 updates.',
      icon: <History size={20} className="text-warning" />,
      badge: 'v1.1.0 Live',
    },
  ];

  return (
    <div className="docs-content">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="brand">Version 1.1.0 Published</Badge>
          <Badge variant="success" dot>Synchronized with Product</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-primary mb-3">Thally Documentation Portal</h1>
        <p className="text-md text-secondary leading-relaxed">
          Welcome to the official developer and product documentation for Thally — kept synchronized with product changes via human-in-the-loop review.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {docCards.map((card) => (
          <Link key={card.slug} href={`/docs/${card.slug}`} className="no-underline">
            <Card hoverable className="h-full flex flex-col justify-between">
              <CardBody className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                    {card.icon}
                  </div>
                  {card.badge && <Badge variant="brand">{card.badge}</Badge>}
                </div>
                <div>
                  <h2 className="font-bold text-md text-primary">{card.title}</h2>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">{card.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-brand font-semibold mt-auto pt-2">
                  <span>Read documentation</span>
                  <ArrowRight size={12} />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="p-5 bg-surface-0 border border-subtle rounded-xl flex flex-col gap-3">
        <h3 className="font-bold text-sm text-primary flex items-center gap-2">
          <CheckCircle2 size={16} className="text-success" />
          <span>Automated Synchronization Guarantee</span>
        </h3>
        <p className="text-xs text-secondary leading-relaxed">
          All documentation on this portal is verified against repository pull requests, unit tests, and maintainer reviews.
          Documentation is only published after all 7 deployment checks pass.
        </p>
      </div>
    </div>
  );
}
