import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with SQ Agriculture Ltd. Reach out for product inquiries, support, or partnership opportunities.',
  openGraph: {
    title: 'Contact Us | SQ Agriculture Ltd.',
    description: 'Get in touch with SQ Agriculture Ltd.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
