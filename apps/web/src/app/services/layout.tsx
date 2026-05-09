import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Comprehensive agricultural services including tractor sales, harvester solutions, spare parts, and 24/7 maintenance support.',
  openGraph: {
    title: 'Services | SQ Agriculture Ltd.',
    description: 'Comprehensive agricultural services and support.',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
