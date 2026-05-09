import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest agricultural insights, tips, and updates from SQ Agriculture Ltd.',
  openGraph: {
    title: 'Blog | SQ Agriculture Ltd.',
    description: 'Latest agricultural insights and updates.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
