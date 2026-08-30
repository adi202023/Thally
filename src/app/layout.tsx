import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Thally - Ethereal Forge | Intelligent Documentation Engine',
  description:
    'Visualizing the flow from raw code changes to synthesized knowledge. Thally agents are actively monitoring your ecosystem.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      "background": "var(--background)",
                      "foreground": "var(--foreground)",
                      "card": "var(--card)",
                      "muted": "var(--muted)",
                      "muted-foreground": "var(--muted-foreground)",
                      "border": "var(--border)",
                      "primary": "var(--primary)",
                      "primary-foreground": "var(--primary-foreground)",
                      "surface": "var(--surface)",
                      "surface-dark": "#090a0f",
                      "inverse-surface": "#090a0f",
                      "inverse-on-surface": "#f4f4f6",
                      "text-primary": "var(--text-primary)",
                      "text-secondary": "var(--text-secondary)",
                      "border-subtle": "var(--border-subtle)",
                      "outline": "#71717a",
                      "outline-variant": "#8a8d98",
                      "surface-container": "#f4f4f5",
                      "surface-container-low": "#fafafa",
                      "surface-container-highest": "#e4e4e7",
                      "surface-variant": "#f4f4f5",
                      "primary-fixed": "#e4e4e7",
                      "primary-fixed-dim": "#f4f4f6",
                      "primary-container": "#27272a",
                      "secondary": "#27272a",
                      "secondary-container": "#27272a",
                      "secondary-fixed": "#e4e4e7",
                      "secondary-fixed-dim": "#a1a1aa",
                      "accent-indigo": "#27272a",
                      "tertiary": "#3f3f46",
                      "tertiary-container": "#27272a",
                      "surface-tint": "#f4f4f6",
                      "glass-surface": "var(--glass-surface)",
                      "error": "#ef4444",
                      "error-container": "#450a0a"
                    },
                    borderRadius: {
                      "DEFAULT": "0.375rem",
                      "md": "0.5rem",
                      "lg": "0.75rem",
                      "xl": "1rem",
                      "2xl": "1.25rem",
                      "full": "9999px"
                    },
                    spacing: {
                      "margin-page": "40px",
                      "card-padding": "20px",
                      "gutter": "24px",
                      "section-gap": "64px",
                      "base": "4px"
                    },
                    fontFamily: {
                      "mono-data": ["JetBrains Mono", "monospace"],
                      "body-md": ["Geist", "sans-serif"],
                      "label-caps": ["JetBrains Mono", "monospace"],
                      "body-sm": ["Geist", "sans-serif"],
                      "headline-lg": ["Geist", "sans-serif"],
                      "headline-lg-mobile": ["Geist", "sans-serif"],
                      "display-hero": ["Geist", "sans-serif"]
                    },
                    fontSize: {
                      "mono-data": ["13px", { "lineHeight": "1.4", "fontWeight": "400" }],
                      "body-md": ["16px", { "lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400" }],
                      "label-caps": ["12px", { "lineHeight": "1", "letterSpacing": "0.1em", "fontWeight": "700" }],
                      "body-sm": ["14px", { "lineHeight": "1.5", "fontWeight": "400" }],
                      "headline-lg": ["32px", { "lineHeight": "1.2", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                      "headline-lg-mobile": ["24px", { "lineHeight": "1.2", "fontWeight": "600" }],
                      "display-hero": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.04em", "fontWeight": "700" }]
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-body-md min-h-screen relative overflow-x-hidden antialiased transition-colors duration-300">
        <QueryProvider>
          <AppLayout>{children}</AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
