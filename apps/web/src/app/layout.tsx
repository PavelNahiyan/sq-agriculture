import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { FloatingContactButton } from '@/components/features/floating-contact-button';

const inter = Inter({ subsets: ['latin'] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sq-agriculture.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'SQ Agriculture Ltd. | Growing Tomorrow\'s Harvest Today',
    template: '%s | SQ Agriculture Ltd.',
  },
  description: 'Your trusted partner for quality seeds, crop protection, and modern farming machinery in Bangladesh.',
  keywords: ['agriculture', 'seeds', 'pesticides', 'farming', 'machinery', 'Bangladesh'],
  authors: [{ name: 'SQ Agriculture Ltd.' }],
  creator: 'SQ Agriculture Ltd.',
  publisher: 'SQ Agriculture Ltd.',
  openGraph: {
    title: 'SQ Agriculture Ltd.',
    description: 'Your trusted partner for quality agricultural solutions',
    url: APP_URL,
    siteName: 'SQ Agriculture Ltd.',
    type: 'website',
    locale: 'en_US',
    countryName: 'Bangladesh',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQ Agriculture Ltd.',
    description: 'Your trusted partner for quality agricultural solutions',
    creator: '@sqagriculture',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <Providers>
          {children}
          <FloatingContactButton />
        </Providers>
      </body>
    </html>
  );
}
