'use client';

import React from 'react';
import Link from 'next/link';
import {
  GitCommit,
  Sparkles,
  FileSearch,
  CheckSquare,
  FileEdit,
  UserCheck,
  Eye,
  GitMerge,
  BookOpen,
  Bot,
  Check,
} from 'lucide-react';

export type PipelineStage =
  | 'change'
  | 'analysis'
  | 'evidence'
  | 'task'
  | 'proposal'
  | 'review'
  | 'preview'
  | 'merge'
  | 'published'
  | 'agent';

export interface WorkflowPipelineProps {
  currentStage?: PipelineStage;
  changeId?: string;
  taskId?: string;
  proposalId?: string;
  previewId?: string;
  className?: string;
}

export function WorkflowPipeline({
  currentStage = 'published',
  changeId = 'change-smartsync-001',
  taskId = 'task-smartsync-001',
  proposalId = 'proposal-smartsync-001',
  previewId = 'preview-smartsync-001',
  className = '',
}: WorkflowPipelineProps) {
  const stages: Array<{
    id: PipelineStage;
    label: string;
    icon: React.ReactNode;
    href: string;
  }> = [
    { id: 'change', label: 'Change', icon: <GitCommit size={12} />, href: `/changes/${changeId}` },
    { id: 'analysis', label: 'Impact', icon: <Sparkles size={12} />, href: `/changes/${changeId}/report` },
    { id: 'evidence', label: 'Evidence', icon: <FileSearch size={12} />, href: `/changes/${changeId}/evidence` },
    { id: 'task', label: 'Task', icon: <CheckSquare size={12} />, href: `/changes/${changeId}/task` },
    { id: 'proposal', label: 'Proposal', icon: <FileEdit size={12} />, href: `/review/${proposalId}` },
    { id: 'review', label: 'Human Review', icon: <UserCheck size={12} />, href: `/review/${proposalId}` },
    { id: 'preview', label: 'Preview', icon: <Eye size={12} />, href: `/preview/${previewId}` },
    { id: 'merge', label: 'Merge', icon: <GitMerge size={12} />, href: `/preview/${previewId}` },
    { id: 'published', label: 'Published Docs', icon: <BookOpen size={12} />, href: '/docs/smart-sync' },
    { id: 'agent', label: 'Agent Sync', icon: <Bot size={12} />, href: '/agent' },
  ];

  const stageOrder: PipelineStage[] = [
    'change',
    'analysis',
    'evidence',
    'task',
    'proposal',
    'review',
    'preview',
    'merge',
    'published',
    'agent',
  ];

  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className={`pipeline ${className}`.trim()}>
      {stages.map((stage, idx) => {
        const isDone = idx < currentIndex || (currentStage === 'agent' && idx <= currentIndex);
        const isActive = idx === currentIndex && currentStage !== 'agent';
        const isPending = idx > currentIndex;

        return (
          <div key={stage.id} className="pipeline-step">
            <Link href={stage.href} className="pipeline-node no-underline" title={`Go to ${stage.label}`}>
              <div
                className={`pipeline-dot ${
                  isDone ? 'done' : isActive ? 'active' : 'pending'
                }`}
              >
                {isDone ? <Check size={12} /> : stage.icon}
              </div>
              <span
                className={`pipeline-label ${
                  isDone ? 'done' : isActive ? 'active' : ''
                }`}
              >
                {stage.label}
              </span>
            </Link>
            {idx < stages.length - 1 && (
              <div className={`pipeline-connector ${isDone ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
