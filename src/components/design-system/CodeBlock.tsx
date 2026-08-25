'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({
  code,
  language = 'typescript',
  showCopy = true,
  className = '',
}: {
  code: string;
  language?: string;
  showCopy?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`code-block ${className}`.trim()}>
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        {showCopy && (
          <button onClick={handleCopy} className="code-block-copy" title="Copy code">
            {copied ? (
              <span className="flex items-center gap-1 text-success">
                <Check size={12} /> Copied
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy size={12} /> Copy
              </span>
            )}
          </button>
        )}
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="inline-code">{children}</code>;
}
