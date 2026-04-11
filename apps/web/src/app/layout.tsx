import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { NextIntlClientProvider } from 'next-intl';
import en from '@/i18n/messages/en.json';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SQ Agriculture Ltd. | Growing Tomorrow\'s Harvest Today',
  description: 'Your trusted partner for quality seeds, crop protection, and modern farming machinery in Bangladesh.',
  keywords: ['agriculture', 'seeds', 'pesticides', 'farming', 'machinery', 'Bangladesh'],
  authors: [{ name: 'SQ Agriculture Ltd.' }],
  openGraph: {
    title: 'SQ Agriculture Ltd.',
    description: 'Your trusted partner for quality agricultural solutions',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider messages={en}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
