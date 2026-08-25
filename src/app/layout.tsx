import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AppLayout } from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'Thally — Keep product knowledge current',
  description:
    'Thally detects meaningful product changes, identifies affected documentation and knowledge, proposes documentation updates, lets a maintainer review them, and keeps published docs and agent knowledge in sync.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <AppLayout>{children}</AppLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
