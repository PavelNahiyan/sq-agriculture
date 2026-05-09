import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse through our gallery showcasing agricultural products, field demonstrations, and events from SQ Agriculture Ltd.',
  openGraph: {
    title: 'Gallery | SQ Agriculture Ltd.',
    description: 'Browse our agricultural gallery.',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
