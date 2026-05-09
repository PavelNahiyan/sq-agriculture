import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Promotional Offers',
  description: 'Check out the latest promotional offers and deals from SQ Agriculture Ltd. on seeds, pesticides, machinery, and more.',
  openGraph: {
    title: 'Promotional Offers | SQ Agriculture Ltd.',
    description: 'Latest promotional offers from SQ Agriculture.',
  },
};

export default function PromotionalOffersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
