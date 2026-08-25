'use client';

import React from 'react';

export function DiffViewer({
  oldText,
  newText,
  oldTitle = 'Current Version',
  newTitle = 'Proposed Version',
}: {
  oldText: string;
  newText: string;
  oldTitle?: string;
  newTitle?: string;
}) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const maxLines = Math.max(oldLines.length, newLines.length);

  return (
    <div className="diff-viewer">
      <div className="diff-header">
        <div className="diff-header-side">
          <span className="status-dot error" />
          <span>{oldTitle}</span>
        </div>
        <div className="diff-header-side">
          <span className="status-dot success" />
          <span>{newTitle}</span>
        </div>
      </div>
      <div className="diff-content">
        <div className="diff-side">
          {Array.from({ length: maxLines }).map((_, i) => {
            const line = oldLines[i];
            const newLine = newLines[i];
            const isRemoved = line !== undefined && line !== newLine;
            return (
              <div
                key={`old-${i}`}
                className={`diff-line ${isRemoved ? 'removed' : ''}`}
              >
                <span className="diff-line-number">{line !== undefined ? i + 1 : ''}</span>
                <span>{line !== undefined ? line || ' ' : ''}</span>
              </div>
            );
          })}
        </div>
        <div className="diff-side">
          {Array.from({ length: maxLines }).map((_, i) => {
            const line = newLines[i];
            const oldLine = oldLines[i];
            const isAdded = line !== undefined && line !== oldLine;
            return (
              <div
                key={`new-${i}`}
                className={`diff-line ${isAdded ? 'added' : ''}`}
              >
                <span className="diff-line-number">{line !== undefined ? i + 1 : ''}</span>
                <span>{line !== undefined ? line || ' ' : ''}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
