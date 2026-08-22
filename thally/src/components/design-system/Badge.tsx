'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'orange';
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  dot = false,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} {...props}>
      {dot && <span className="badge-dot" style={{ backgroundColor: 'currentColor' }} />}
      {children}
    </span>
  );
}

export function StatusIndicator({
  status,
  label,
  pulse = false,
}: {
  status: 'success' | 'warning' | 'error' | 'info' | 'default' | 'brand';
  label?: string;
  pulse?: boolean;
}) {
  return (
    <div className="status-indicator">
      <span className={`status-dot ${status} ${pulse ? 'pulse-success' : ''}`} />
      {label && <span>{label}</span>}
    </div>
  );
}
