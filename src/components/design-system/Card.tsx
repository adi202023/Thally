'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div className={`card ${hoverable ? 'card-hover' : ''} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`card-title ${className}`.trim()} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-body ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-footer ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
