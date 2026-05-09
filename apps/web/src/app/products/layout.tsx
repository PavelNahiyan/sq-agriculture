import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Explore our wide range of agricultural products including seeds, pesticides, fertilizers, machinery, and more.',
  openGraph: {
    title: 'Products | SQ Agriculture Ltd.',
    description: 'Explore our wide range of agricultural products.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
