import '../styles/global.css';
import '../styles/services.css';
import '../styles/mobile.css';
import '../styles/refresh.css';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { getPageContext } from '../lib/server-context';
import ClientEnhancements from '../components/ClientEnhancements';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' }],
    apple: '/apple-touch-icon.png',
  },
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fb771a',
};
export default async function RootLayout({ children }: { children: ReactNode }) {
  const ctx = await getPageContext();
  return (
    <html lang="ko" data-theme="light" suppressHydrationWarning>
      <head>
        <meta name="csrf-token" content={ctx.locals.csrf} />
        <script src="/theme.js" />
      </head>
      <body>
        {children}
        <Suspense fallback={null}>
          <ClientEnhancements />
        </Suspense>
      </body>
    </html>
  );
}
