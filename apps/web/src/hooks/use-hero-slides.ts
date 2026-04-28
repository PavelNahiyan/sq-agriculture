import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface HeroSlide {
  id: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  image: string;
  mobileImage?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: number;
}

export function useHeroSlides(activeOnly = true) {
  return useQuery({
    queryKey: ['heroSlides', activeOnly],
    queryFn: async () => {
      const response: any = await api.get(`/hero-slides?activeOnly=${activeOnly}`);
      return response.data as HeroSlide[];
    },
  });
}
