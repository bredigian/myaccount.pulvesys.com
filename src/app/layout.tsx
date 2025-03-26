import './globals.css';

import type { Metadata, Viewport } from 'next';

import { Geist } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  subsets: ['latin'],
});

const APP_NAME = 'PulveSys';
const APP_DEFAULT_TITLE = 'PulveSys';
const APP_TITLE_TEMPLATE = '%s | PulveSys';
const APP_DESCRIPTION = 'Sistema de órdenes de pulverización.';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  description: APP_DESCRIPTION,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute={'class'} defaultTheme='system' enableSystem>
          {children}
          <Toaster theme='system' />
        </ThemeProvider>
      </body>
    </html>
  );
}
