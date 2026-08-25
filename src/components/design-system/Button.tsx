'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClass = size === 'md' ? '' : `btn-${size}`;
    const variantClass = `btn-${variant}`;
    const loadingClass = isLoading ? 'btn-loading' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`btn ${variantClass} ${sizeClass} ${loadingClass} ${className}`.trim()}
        {...props}
      >
        {!isLoading && leftIcon}
        {isLoading && <Loader2 className="animate-spin" size={14} />}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
