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
                      "tertiary": "#8127cf",
                      "tertiary-fixed": "#f0dbff",
                      "inverse-on-surface": "#f0f1f2",
                      "on-secondary": "#ffffff",
                      "on-background": "#191c1d",
                      "surface": "#f8f9fa",
                      "primary-fixed": "#e9ddff",
                      "on-primary-fixed-variant": "#5516be",
                      "secondary-container": "#6063ee",
                      "surface-container": "#edeeef",
                      "outline": "#7b7486",
                      "surface-container-highest": "#e1e3e4",
                      "secondary-fixed": "#e1e0ff",
                      "background": "#f8f9fa",
                      "text-primary": "#1A1A1E",
                      "on-error-container": "#93000a",
                      "on-surface-variant": "#494454",
                      "tertiary-container": "#9c48ea",
                      "on-tertiary": "#ffffff",
                      "surface-tint": "#6d3bd7",
                      "tertiary-fixed-dim": "#ddb7ff",
                      "surface-container-low": "#f3f4f5",
                      "secondary": "#4648d4",
                      "on-tertiary-fixed": "#2c0051",
                      "on-surface": "#191c1d",
                      "surface-dim": "#d9dadb",
                      "on-error": "#ffffff",
                      "on-primary-fixed": "#23005c",
                      "glass-surface": "rgba(255, 255, 255, 0.7)",
                      "error": "#ba1a1a",
                      "error-container": "#ffdad6",
                      "surface-bright": "#f8f9fa",
                      "inverse-surface": "#2e3132",
                      "secondary-fixed-dim": "#c0c1ff",
                      "primary": "#6b38d4",
                      "accent-indigo": "#4f46e5",
                      "outline-variant": "#cbc3d7",
                      "surface-container-lowest": "#ffffff",
                      "on-tertiary-fixed-variant": "#6900b3",
                      "on-secondary-fixed-variant": "#2f2ebe",
                      "on-tertiary-container": "#fffbff",
                      "inverse-primary": "#d0bcff",
                      "on-primary": "#ffffff",
                      "on-secondary-container": "#fffbff",
                      "text-secondary": "#4A4A4E",
                      "on-secondary-fixed": "#07006c",
                      "primary-fixed-dim": "#d0bcff",
                      "on-primary-container": "#fffbff",
                      "border-subtle": "rgba(0, 0, 0, 0.08)",
                      "surface-variant": "#e1e3e4",
                      "primary-container": "#8455ef",
                      "surface-container-high": "#e7e8e9"
                    },
                    borderRadius: {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
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
      <body className="bg-background dark:bg-inverse-surface text-text-primary dark:text-inverse-on-surface font-body-md min-h-screen relative overflow-x-hidden antialiased transition-colors duration-300">
        <QueryProvider>
          <AppLayout>{children}</AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
