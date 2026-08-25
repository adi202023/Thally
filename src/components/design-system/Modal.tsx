'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'md' ? '' : `modal-${size}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${sizeClass}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              onClick={onClose}
              className="btn-icon btn-ghost btn-xs"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'md' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = size === 'xl' ? 'drawer-xl' : '';

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className={`drawer ${sizeClass}`.trim()}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className="drawer-header">
            <h3 className="drawer-title">{title}</h3>
            <button
              onClick={onClose}
              className="btn-icon btn-ghost btn-xs"
              aria-label="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </div>
  );
}
