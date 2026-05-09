import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Store Locator',
  description: 'Find SQ Agriculture dealers and stores near you. Locate agricultural products and services across Bangladesh.',
  openGraph: {
    title: 'Store Locator | SQ Agriculture Ltd.',
    description: 'Find SQ Agriculture dealers near you.',
  },
};

export default function StoreLocatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
