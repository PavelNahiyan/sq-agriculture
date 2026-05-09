import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about SQ Agriculture Ltd., our mission, values, and commitment to empowering Bangladeshi farmers with quality agricultural solutions.',
  openGraph: {
    title: 'About Us | SQ Agriculture Ltd.',
    description: 'Learn about SQ Agriculture Ltd.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
